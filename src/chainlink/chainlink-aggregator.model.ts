import { encodeEventFragment } from '../utils/web3.utils';
import { AccessControlledOffchainAggregator } from '../abis/AccessControlledOffchainAggregator';
import { Topic as TopicType } from 'web3';

export const Topic = Object.freeze({
    NewTransmission: encodeEventFragment('NewTransmission', AccessControlledOffchainAggregator) as TopicType,
});
