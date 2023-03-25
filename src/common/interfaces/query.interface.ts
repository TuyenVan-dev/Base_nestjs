export interface IQuery {
  page: number;
  limit: number;
  sort?: string | object;
  ref?: string;
  term?: string;
}

export interface IQueryCursor {
  skip: number;
  limit: number;
  sort: object;
}
