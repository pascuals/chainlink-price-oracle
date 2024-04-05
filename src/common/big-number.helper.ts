import { BigNumberish } from 'ethers';
import BigNumber from 'bignumber.js';

export function divide(dividend: BigNumber | bigint | string, divider: BigNumberish) {
    return BigNumber(dividend.toString()).div(divider.toString());
}
