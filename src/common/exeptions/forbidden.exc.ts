import { HttpException, HttpStatus } from '@nestjs/common';
import { EErrorMessage } from '../interfaces/message.interface';

export class ForbiddenException extends HttpException {
  constructor(message?: string) {
    super(message || EErrorMessage.PERMISSION_DENIED, HttpStatus.FORBIDDEN);
  }
}
