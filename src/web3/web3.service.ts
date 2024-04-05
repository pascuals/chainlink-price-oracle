import { Web3Provider } from './web3.provider';
import { Contract, HexString } from 'web3';
import { Injectable } from '@nestjs/common';
import { BaseWeb3Error } from 'web3-errors';

@Injectable()
export class Web3Service {
    constructor(private readonly _web3Provider: Web3Provider) {}

    public get eth() {
        return this._web3Provider.eth;
    }

    public createContract(abi: any, contractAddress: HexString) {
        return new Contract(abi, contractAddress, this._web3Provider.context);
    }

    async wrapCall<T>(method: any, ...args: any[]): Promise<T> {
        let result = null;

        try {
            result = await method(...args).call();
        } catch (err: any) {
            const e = err as BaseWeb3Error;
            console.error(`Error: ${e?.cause || err?.result?.message || e?.message}`);
        }

        return result;
    }
}
