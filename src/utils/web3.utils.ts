import { EventFragment } from 'ethers';
import { AbiEventFragment, AbiInput, HexString, Web3 } from 'web3';
import { ContractAbi } from 'web3-types/src/eth_abi_types';

const web3 = new Web3();

/**
 * Encode an event signature from the name event and its abi fragment
 */
export function encodeEventFragment(name: string, abiFragment: any[]): string {
    // const _interface = new ethers.Interface(abiFragment);
    // const _event = _interface.getEvent(name);
    const _eventAbi = abiFragment.filter((_func) => _func['name'] == name && _func.type === 'event')[0];
    return EventFragment.from(_eventAbi).topicHash;
}

export function extractEventInputs(abi: ContractAbi, eventName: string) {
    return abi
        .find((chunk) => chunk.type === 'event' && (chunk as AbiEventFragment).name === eventName)
        ['inputs'].filter((input) => input.indexed == false) as AbiInput[];
}

export function decodeParameters(abi: ContractAbi, eventName: string, bytes: HexString) {
    return web3.eth.abi.decodeParameters(extractEventInputs(abi, eventName), bytes);
}
