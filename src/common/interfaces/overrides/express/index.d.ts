import { IUser } from 'src/modules/user/user.interface';
import { IQueryCursor } from '../../query.interface';

declare global {
  declare namespace Express {
    interface Request {
      cursor: IQueryCursor;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends IUser {}
  }
}
