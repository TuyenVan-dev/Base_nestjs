import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IQueryCursor } from '../interfaces/query.interface';

export const Pagination = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const { limit = 15, sort = 'updatedAt -1', page = 1 } = request.query;

  const limitCustom = Number(limit);
  const sortArr = sort.split(' ');
  const sortCustom = {};
  if (sortArr.length === 2) {
    sortCustom[sortArr[0]] = sortArr[1];
  }

  const skip: number = (Number(page) - 1) * Number(limit);

  const cursor: IQueryCursor = {
    limit: limitCustom,
    sort: sortCustom,
    skip,
  };

  return cursor;
});
