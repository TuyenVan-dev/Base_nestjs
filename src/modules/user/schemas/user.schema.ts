import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { IUser, ERoleUser, EAccountType } from '../user.interface';
import { compare } from 'bcrypt';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class User implements IUser {
  @Prop({ required: true, unique: true, minlength: 3, maxlength: 40, trim: true, lowercase: true })
  username: string;

  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, default: ERoleUser.MEMBER })
  level: ERoleUser;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  ref: string;

  @Prop()
  expiredAt: number;

  @Prop({ required: true })
  keywords: string[];

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now() })
  passwordUpdatedAt: number;

  @Prop({ required: true, default: 0 })
  credit: number;

  @Prop({ required: true, default: 0 })
  creditOrigin: number;

  @Prop()
  parentTree: string;

  @Prop({ required: true, default: EAccountType.PREMIUM })
  accountType: EAccountType;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: true, default: true })
  parentIsActive: boolean;

  async comparePasswords(password: string): Promise<boolean> {
    const valid = await compare(password, this.password);
    return valid ?? false;
  }

  view(): IUser {
    const view: any = {};
    const fields = [
      'id',
      'name',
      'username',
      'level',
      'ref',
      'passwordUpdatedAt',
      'accountType',
      'parentTree',
      'credit',
      'creditOrigin',
      'isActive',
      'parentIsActive',
      'expiredAt',
      'createdAt',
      'updatedAt',
    ];
    fields.forEach(field => {
      view[field] = this[field];
    });

    return view;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);
