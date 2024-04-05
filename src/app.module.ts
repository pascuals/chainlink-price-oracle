import { Module } from '@nestjs/common';
import { ChainLinkOracleService } from './chain-link-oracle.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ChainLinkOracleService],
})
export class AppModule {
}
