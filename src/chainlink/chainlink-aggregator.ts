import { Contract, Log } from 'web3';
import { AccessControlledOffchainAggregator } from '../abis/AccessControlledOffchainAggregator';
import { Web3Service } from '../web3/web3.service';
import { Topic } from './chainlink-aggregator.model';
import { decodeParameters } from '../utils/web3.utils';
import { ChainlinkAggregatorProxyService } from './chainlink-aggregator-proxy.service';
import { convertToBigNumber } from './chainlink-aggregator.utils';

export class ChainlinkAggregator {
    private readonly _contract: Contract<any>;

    constructor(
        private readonly _chainLinkAggregatorProxyService: ChainlinkAggregatorProxyService,
        private readonly _web3Service: Web3Service,
        aggregatorAddress: string
    ) {
        this._contract = this._web3Service.createContract(AccessControlledOffchainAggregator, aggregatorAddress);
    }

    async getPastPrices(blocksAgo: number) {
        const currentBlock = await this._web3Service.eth.getBlock();
        const logs = (await this._web3Service.eth.getPastLogs({
            address: this._contract.options.address,
            topics: [Topic.NewTransmission],
            fromBlock: currentBlock.number - BigInt(blocksAgo),
            toBlock: currentBlock.number,
        })) as any;

        const parsedLogs = logs.map((log: Log) => {
            return {
                block: log.blockNumber,
                data: decodeParameters(AccessControlledOffchainAggregator, 'NewTransmission', log.data.toString()),
            };
        }) as [{ block: bigint; data: { answer: bigint } }];

        const decimals = await this._chainLinkAggregatorProxyService.getDecimals();

        return parsedLogs.map(result => [result.block, convertToBigNumber(result.data.answer, decimals).toFixed()]);
    }
}
