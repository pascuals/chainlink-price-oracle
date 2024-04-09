import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ChainlinkAggregatorProxyService } from './chainlink/chainlink-aggregator-proxy.service';

const BLOCK_AGO = 50;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const chainLinkOracleService = app.select(AppModule).get(ChainlinkAggregatorProxyService, { strict: true });

    const description = await chainLinkOracleService.getDescription();
    const aggregatorAddress = await chainLinkOracleService.getAggregatorAddress();
    const latestPrice = await chainLinkOracleService.getLatestPrice();
    const aggregatorService = await chainLinkOracleService.getAggregator();
    const pastPrices = await aggregatorService.getPastPrices(BLOCK_AGO);

    console.log();
    console.log(`Prices for ${description.join(' to ')} (aggregator ${aggregatorAddress}):`);
    console.log(`Last ${description[0]} price: ${latestPrice.toFixed()} ${description[1]}`);
    console.log(
        `Past prices on the last ${BLOCK_AGO} blocks:`,
        pastPrices.map(
            pastPrice => `Block: ${Number(pastPrice[0])}, ${description[0]} price: ${pastPrice[1]} ${description[1]}`
        )
    );
    console.log();

    await app.close();
}

void bootstrap();
