import { BadRequestException } from 'src/common/exeptions/bad-request.exc';
import { EErrorMessage } from 'src/common/interfaces/message.interface';
import { userInTree } from 'src/common/utils/common';
import { EAccountType, ERoleUser, ICreateUser, IUser } from '../user.interface';

export const validateUserCalc = async (userRequest: IUser, body: IUser, userNeedUpdate?: IUser) => {
  // validate tín dụng của của ADMIN, AGENT

  if (!userNeedUpdate) {
    if ([ERoleUser.MASTER, ERoleUser.AGENT].includes(userRequest.level) && userRequest.credit < Number(body.credit)) {
      throw new BadRequestException(EErrorMessage.OUT_OF_CREDIT);
    }

    // validate tín dụng của agent ko vượt quá số còn lại của admin
    if (
      (userRequest.level === ERoleUser.ADMIN || userRequest.level === ERoleUser.AGENT) &&
      body.credit > userRequest.credit &&
      userRequest.accountType === EAccountType.PREMIUM
    ) {
      throw new BadRequestException(EErrorMessage.OUT_OF_CREDIT);
    }
  }

  if (userNeedUpdate) {
    // nếu người sửa không trong nhánh thì ko đc phép sửa
    if (
      !userInTree({
        tree: userNeedUpdate.parentTree,
        username: userRequest.username,
      })
    ) {
      throw new BadRequestException(EErrorMessage.PERMISSION_DENIED);
    }
  }
};
