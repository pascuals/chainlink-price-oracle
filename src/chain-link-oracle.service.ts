import { Injectable } from '@nestjs/common';

@Injectable()
export class ChainLinkOracleService {
  getHello(): string {
    return 'Hello World!';
  }
}
