import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ChainLinkOracleService } from './chain-link-oracle.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const chainLinkOracleService = app.select(AppModule).get(ChainLinkOracleService, { strict: true });

  const result = chainLinkOracleService.getHello();

  console.log(result);

  await app.close();
}

void bootstrap();
