import { UserSchema } from '../schemas/user.schema';
import { hash } from 'bcrypt';

function preSave(next) {
  if (!this.isModified('password')) return next();

  if (this.password) {
    hash(this.password.trim(), 9)
      .then(hash => {
        this.password = hash;
        this.passwordUpdatedAt = Date.now();
        next();
      })
      .catch(next);
  }
}

export const userFactory = () => {
  const schema = UserSchema;
  schema.pre('save', preSave);
  return schema;
};
