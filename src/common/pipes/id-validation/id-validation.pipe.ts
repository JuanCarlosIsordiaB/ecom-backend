import {  BadRequestException, Injectable, ParseIntPipe } from '@nestjs/common';

@Injectable()
export class IdValidationPipe extends ParseIntPipe {
  constructor() {
    super({
      exceptionFactory: () => {
        return new BadRequestException('Invalid ID format');
      }
    })
  }
}
