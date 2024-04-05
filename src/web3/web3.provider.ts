import { Web3, Web3BaseProvider, Web3Context, Web3EthExecutionAPI, Web3EthInterface } from 'web3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Web3Provider {
    private readonly _web3: Web3;

    constructor(private readonly _configService: ConfigService) {
        this._web3 = new Web3(this._configService.get<string>('RPC_ENDPOINT'));
    }

    public get utils() {
        return this._web3.utils;
    }

    public get eth(): Web3EthInterface {
        return this._web3.eth;
    }

    public get provider(): Web3BaseProvider<Web3EthExecutionAPI> {
        return this._web3.eth.provider;
    }

    public get context() {
        return new Web3Context(this.provider);
    }
}
