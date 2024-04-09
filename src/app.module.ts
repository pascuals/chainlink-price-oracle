import { Module } from '@nestjs/common';
import { ChainlinkAggregatorProxyService } from './chainlink/chainlink-aggregator-proxy.service';
import { Web3Service } from './web3/web3.service';
import { Web3Provider } from './web3/web3.provider';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '../config/configuration';
import { validationSchema } from '../config/validation';

@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true,
            envFilePath: `${process.cwd()}/config/environment/.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`,
            isGlobal: true,
            load: [configuration],
            validationSchema,
        }),
    ],
    controllers: [],
    providers: [Web3Provider, Web3Service, ChainlinkAggregatorProxyService],
})
export class AppModule {}
