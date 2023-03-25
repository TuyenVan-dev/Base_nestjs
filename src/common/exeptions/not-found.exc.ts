import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(message ?? 'Notfound', HttpStatus.NOT_FOUND);
  }
}
