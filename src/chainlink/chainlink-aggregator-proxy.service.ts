import { Injectable } from '@nestjs/common';
import { Contract } from 'web3';
import { EACAggregatorProxy } from '../abis/EACAggregatorProxy';
import { ConfigService } from '@nestjs/config';
import BigNumber from 'bignumber.js';
import { LatestPriceResult } from './chainlink-aggregator-proxy.model';
import { Web3Service } from '../web3/web3.service';
import { ChainlinkAggregator } from './chainlink-aggregator';
import { convertToBigNumber } from './chainlink-aggregator.utils';

@Injectable()
export class ChainlinkAggregatorProxyService {
    private readonly _contract: Contract<any>;
    private _aggregatorService: ChainlinkAggregator;
    private _decimals: bigint;
    private _description: string[];

    constructor(
        private readonly _web3Service: Web3Service,
        private readonly _configService: ConfigService
    ) {
        this._contract = this._web3Service.createContract(
            EACAggregatorProxy,
            this._configService.get<string>('CHAINLINK_AGGREGATOR_PROXY_ADDRESS')
        );
    }

    async getDescription() {
        if (this._description == null) {
            const description = (await this._web3Service.wrapCall(this._contract.methods.description)) as string;
            this._description = description.split(`/`).map((part) => part.trim());
        }

        return this._description;
    }

    async getAggregatorAddress(): Promise<string> {
        return this._web3Service.wrapCall(this._contract.methods.aggregator);
    }

    async getLatestPrice(): Promise<BigNumber> {
        const result = (await this._web3Service.wrapCall(this._contract.methods.latestRoundData)) as LatestPriceResult;
        const decimals = await this.getDecimals();
        return convertToBigNumber(result.answer, decimals);
    }

    async getAggregator(): Promise<ChainlinkAggregator> {
        if (this._aggregatorService == null) {
            const aggregatorAddress = await this.getAggregatorAddress();
            this._aggregatorService = new ChainlinkAggregator(this, this._web3Service, aggregatorAddress);
        }

        return this._aggregatorService;
    }

    async getDecimals() {
        if (this._decimals == null) {
            this._decimals = (await this._web3Service.wrapCall(this._contract.methods.decimals)) as bigint;
        }

        return this._decimals;
    }
}
