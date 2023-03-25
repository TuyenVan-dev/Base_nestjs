import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { BadRequestException } from 'src/common/exeptions/bad-request.exc';
import { ForbiddenException } from 'src/common/exeptions/forbidden.exc';
import { NotFoundException } from 'src/common/exeptions/not-found.exc';
import { EErrorMessage } from 'src/common/interfaces/message.interface';
import { IQueryCursor } from 'src/common/interfaces/query.interface';
import { IResponseList } from 'src/common/interfaces/response.interface';
import { getUserRefs, removeVNLang, userInTree } from 'src/common/utils/common';
import { User, UserDocument } from './schemas/user.schema';
import { EAccountType, ERoleRefUser, ERoleUser, ETypeEditCredit, ICreateUser, IUpdateUser, IUser } from './user.interface';
import { validateUserCalc } from './utils/validate-user';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserSchema: Model<UserDocument>) {}

  /**
   * @name getUser
   * @param req
   * @param cursor
   * @returns
   */
  async getUser(req: Request, cursor: IQueryCursor): Promise<IResponseList<IUser>> {
    const { term, ref } = req.query;

    const where: any = {};
    if (ref) {
      if (req.user.level !== ERoleUser.MEMBER) {
        const userRef = await this.UserSchema.findOne({
          username: ref,
        });
        if (!userRef) throw new NotFoundException(EErrorMessage.USER_NOT_EXSITED);
        where.ref = userRef.id;
      }
    } else {
      where.ref = req.user.id;
    }
    if (term) {
      where.keywords = {
        contains: removeVNLang(term),
      };
    }

    const users = await this.UserSchema.find(where, null, cursor);
    const rows = users.map(user => user.view());
    const count = await this.UserSchema.countDocuments(where);

    return { rows, count };
  }

  /**
   * @name createUser
   * @param body
   * @param req
   * @returns
   */
  async createUser(body: ICreateUser, req: Request): Promise<IUser> {
    const userExisted = await this.UserSchema.findOne({ username: body.username });
    if (userExisted) {
      throw new NotFoundException(EErrorMessage.USER_EXSITED);
    }

    const userRequest = req.user;

    await validateUserCalc(userRequest, body, null);

    const payload: IUser = {
      ...body,
      creditOrigin: body.credit,
      // tạo user với role tương ứng với role hiện tại
      level: ERoleRefUser[userRequest.level],
      ref: userRequest.id,
      parentTree: `${userRequest.parentTree + '|' ?? ''}${userRequest.username}`,
    };

    // kiểm tra user unlimited
    if (userRequest.accountType === EAccountType.FREE) payload.accountType = EAccountType.FREE;

    // Dành cho tài khoản thử nghiệm
    if (userRequest.accountType == EAccountType.TRIAL) {
      payload.accountType = EAccountType.TRIAL;
      payload.expiredAt = userRequest.expiredAt;
    }

    // ngày hết hạn member sẽ bằng ngày tạo + 1 tháng
    if (payload.level === ERoleUser.MEMBER && userRequest.accountType === EAccountType.PREMIUM) {
      payload.expiredAt = moment().add(1, 'month').endOf('d').valueOf();
    }

    const userCreated = await this.UserSchema.create(payload);
    if (userRequest.accountType === EAccountType.PREMIUM) {
      await this.UserSchema.findByIdAndUpdate(userRequest.id, {
        credit: userRequest?.credit - payload.credit,
      });
    }

    return userCreated.view();
  }

  /**
   * @name updateUser
   * @param body
   * @param req
   * @returns
   */
  async updateUser(body: IUpdateUser, req: Request): Promise<IUser> {
    const { id } = req?.params;

    const userExisted = await this.UserSchema.findById(id);
    if (!userExisted) {
      throw new NotFoundException(EErrorMessage.USER_EXSITED);
    }
    const userRequest = req.user;

    await validateUserCalc(userRequest, body, userExisted);

    userExisted.isActive = body.isActive;
    userExisted.name = body.name;
    if (body.password) userExisted.password = body.password.trim();

    const data = await userExisted.save();
    return data.view();
  }

  /**
   * @name handleRenewCredit
   * @param userId
   * @param req
   * @returns boolean
   */
  async handleRenewCredit() {
    const members = await this.UserSchema.find({
      level: ERoleUser.MEMBER,
      accountType: EAccountType.PREMIUM,
      isActive: true,
      parentIsActive: true,
    });
    if (!members) throw new NotFoundException(EErrorMessage.CAN_NOT_FIND_REF);

    await Promise.all(
      members.map(async member => {
        await this.UserSchema.findOneAndUpdate(member.id, {
          credit: member.creditOrigin,
        });
      }),
    );

    return true;
  }

  async changeCredit(body: any, req: Request): Promise<IUser> {
    const user = await this.UserSchema.findById(req.params.id);
    if (!user) throw new NotFoundException(EErrorMessage.USER_NOT_EXSITED);

    const userRequest = req.user;
    // check quyền sửa user của role agent
    if (
      !userInTree({
        tree: user.parentTree,
        username: userRequest.username,
      })
    ) {
      // nếu user cần sửa không phải do người sửa tạo thì báo lỗi
      throw new BadRequestException(EErrorMessage.PERMISSION_DENIED);
    }

    if (user.accountType === EAccountType.FREE) {
      throw new BadRequestException(EErrorMessage.USER_FREE);
    }
    const userRef = await this.UserSchema.findById(user.ref);
    if (!userRef) throw new BadRequestException(EErrorMessage.CAN_NOT_FIND_REF);

    if (user.level === ERoleUser.ADMIN) {
      throw new ForbiddenException();
    }

    const { type, value } = body;

    let afterCredit = Number(user?.credit) || 0;
    let afterCreditOrigin = Number(user?.creditOrigin) || 0;
    let afterCreditUserRef = Number(userRef?.credit) || 0;

    switch (type) {
      case ETypeEditCredit.increase: {
        if (userRef.credit < value) {
          throw new BadRequestException(`${EErrorMessage.OUT_OF_CREDIT}`);
        }
        afterCredit += Number(value);
        afterCreditOrigin += Number(value);

        if (userRef.level !== ERoleUser.ADMIN) {
          afterCreditUserRef -= Number(value);
        }
        break;
      }
      case ETypeEditCredit.decrease: {
        afterCredit -= Number(value);

        if (afterCredit < 0) {
          throw new BadRequestException(EErrorMessage.OUT_OF_CREDIT);
        }
        afterCreditOrigin -= Number(value);
        // cộng thêm tiền cho user ref
        if (userRef.level !== ERoleUser.ADMIN) {
          afterCreditUserRef += Number(value);
        }
        break;
      }
      default:
        break;
    }
    const [data] = await Promise.all([
      this.UserSchema.findByIdAndUpdate(
        user.id,
        {
          credit: afterCredit,
          creditOrigin: afterCreditOrigin,
        },
        { new: true },
      ).exec(),
      this.UserSchema.findByIdAndUpdate(userRef.id, {
        credit: afterCreditUserRef,
      }),
    ]);

    const result = {
      ...data.view(),
    };
    // nếu người sửa credit là ref trực tiếp thì trả về để trừ đi số tiền trên frontend
    if (userRef.id === req.user.id && req.user.level !== ERoleUser.ADMIN) {
      // @ts-ignore
      result.creditRef = afterCreditUserRef;
    }

    return result;
  }

  /**
   *
   * @param username
   * @returns IUser
   */
  async getByUsername(username: string, userRequest: IUser): Promise<IUser> {
    const user = await this.UserSchema.findOne({ username });

    if (
      !userInTree({
        tree: user.parentTree,
        username: userRequest.username,
      })
    ) {
      // nếu user cần sửa không phải do người sửa tạo thì báo lỗi
      throw new BadRequestException(EErrorMessage.PERMISSION_DENIED);
    }
    return user.view();
  }
}
