import { divide } from '../common/big-number.helper';

export function convertToBigNumber(number: bigint, decimals: bigint) {
    return divide(number, 10n ** decimals);
}
