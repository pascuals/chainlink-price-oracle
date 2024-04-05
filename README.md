## Description

Chainlink Oracle consumer example app (EVM compatible chains)

## Motivation

Read the latest USD prices from decentralized Chainlink price feed oracles. 

## Chainlink price feeds

Chainlink Price Feeds are a type of onchain and offchain data feed offered by Chainlink. Price aggregator contracts are updated in real time (the update rate depends on the blockchain always meeting a specific deviation threshold, i.e., 0.25% for USDC/USD).

### How to use
Ideally, we would read all the information from Feed registries. Feed registries work as central consumption points for all aggregators*.
![Feed registry](https://github.com/pascuals/chainlink-price-oracle/assets/1655541/0f35d1ee-e207-46f8-a772-e3d05b88ed94)
(*) Unfortunately, these are only [available on Ethereum](https://docs.chain.link/data-feeds/feed-registry#contract-addresses), and we would like to read the most up-to-date price which is usually provided by L2 chains like Arbitrum and Polygon.

### Current prices
Chainlink price feed functions are described in the following link:\
https://docs.chain.link/data-feeds/api-reference/#variables-and-functions-in-accesscontrolledoffchainaggregator

We will use [`latestRoundData`](https://docs.chain.link/data-feeds/api-reference/#latestrounddata-1) function (`lastAnswer` has been deprecated) to get the most recent price.
https://github.com/pascuals/chainlink-price-oracle/blob/main/src/chainlink/chainlink-aggregator-proxy.service.ts#L42

### Historical prices
For historical prices, there are two options (assuming 50 blocks range on `getPastLogs` calls):
1. Backwards compatible to check the prices one by one.
    1. Following the Chainlink recommendations described here for [Data Feed Historial Rounds](https://docs.chain.link/data-feeds/historical-data#historical-rounds), `roundId` backwards extraction is explained in the following link: [Historical roundId calculation](https://docs.chain.link/data-feeds/historical-data#roundid-in-proxy).
    1. This option is optimal on chains like Ethereum where prices are updated less often (every several minutes for a 0.5% threshold https://etherscan.io/address/0xE62B71cf983019BFf55bC83B48601ce8419650CC), and it will require fewer calls to compute historical price calls.
1. Obtain the aggregator contract and rely on web3 `getPastLogs` calls to retrieve and decode `NewTransmission` event data.
    1. This could be achieved by reading the [`aggregator`](https://github.com/pascuals/chainlink-price-oracle/blob/main/src/chainlink/chainlink-aggregator-proxy.service.ts#L38) address variable from the [proxy contract](https://polygonscan.com/address/0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7#readContract) and then iterating over [`getPastLogs` `TransmiteEvent` calls](https://github.com/pascuals/chainlink-price-oracle/blob/main/src/chainlink/chainlink-aggregator.ts#L22) to retrieve prices.
    1. This option is optimal for L2 chains like Polygon or Arbitrum, as just one call to `getPastLogs` would retrieve several prices at a time, saving rcp calls and potential usage costs.
    1. Price Aggregator ABI could be extracted from the contract verified abi from the specific scanners:\
https://polygonscan.com/address/0xf9c53A834F60cBbE40E27702276fBc0819B3aFAD#code

As a common computation requirement to display decimal prices, the value of `lastRoundData.answer` (for current price calls) and `NewTransmission` event `data.answer` (for historical `getPastLogs` price calls) would have to be divided by the feed/aggregator `decimals` value. See the follwing examples for [current price calls](https://github.com/pascuals/chainlink-price-oracle/blob/main/src/chainlink/chainlink-aggregator-proxy.service.ts#L44) and [historical price calls](https://github.com/pascuals/chainlink-price-oracle/blob/main/src/chainlink/chainlink-aggregator.ts#L40).

### Links
[Reading data feeds offchain](https://docs.chain.link/data-feeds/using-data-feeds#reading-data-feeds-offchain)

#### Stablecoin links
- USDC
    - [Price feed address for USDC](https://docs.chain.link/data-feeds/price-feeds/addresses?network=polygon&page=1&categories=low&search=USDC+%2F+USD)
    - [USDC/USD data feed status](https://data.chain.link/feeds/ethereum/polygon/usdc-usd)
    - [Chainlink Polygon USDC/USD Feed contract](https://polygonscan.com/address/0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7#readContract)

- USDT
    - [Price feed address for USDT](https://docs.chain.link/data-feeds/price-feeds/addresses?network=polygon&page=1&categories=low&search=USDT+%2F+USD)
    - [USDT/USD data feed status](https://data.chain.link/feeds/polygon/mainnet/usdt-usd)
    - [Chainlink Polygon USDT/USD Feed contract](https://polygonscan.com/address/0x0A6513e40db6EB1b165753AD52E80663aeA50545#readContract)

- DAI
    - [Price feed address for DAI](https://docs.chain.link/data-feeds/price-feeds/addresses?network=polygon&page=1&categories=low&search=DAI+%2F+USD)
    - [DAI/USD data feed status](https://data.chain.link/feeds/polygon/mainnet/dai-usd)
    - [Chainlink Polygon DAI/USD Feed contract](https://polygonscan.com/address/0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D#readContract)



## Usage

```bash
$ npm install
$ npm start
```

### Example output

```typescript
Prices for USDC to USD (aggregator 0xf9c53A834F60cBbE40E27702276fBc0819B3aFAD):
Last USDC price: 0.99993998 USD
Past prices on the last 50 blocks: [
  'Block: 55467021, USDC price: 0.99995311 USD',
  'Block: 55467023, USDC price: 0.99995311 USD',
  'Block: 55467032, USDC price: 0.99995998 USD',
  'Block: 55467046, USDC price: 0.99993998 USD',
  'Block: 55467051, USDC price: 0.99996345 USD',
  'Block: 55467056, USDC price: 0.99994567 USD',
  'Block: 55467060, USDC price: 0.99993998 USD'
]
```

## TODO
- Implmement Solana price feeds
  - Docs: https://docs.chain.link/data-feeds/solana/using-data-feeds-off-chain
  - Guide: https://docs.chain.link/data-feeds/solana/using-data-feeds-off-chain#adding-data-feeds-to-an-existing-offchain-project
  - Starter kit: https://github.com/smartcontractkit/solana-starter-kit

## About

- Author: [Nacho G. Pascual](https://github.com/pascuals)
- Website: [Dextools](https://www.dextools.io)
