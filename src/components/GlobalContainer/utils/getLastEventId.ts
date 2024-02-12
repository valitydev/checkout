import { PaymentCondition } from '../../../common/paymentCondition';
import { isNil, last } from '../../../common/utils';

export const getLastEventId = (conditions: PaymentCondition[]): number => {
    const lastCondition = last(conditions);
    if (isNil(lastCondition)) return 0;
    // 'eventId' is not present in every condition object type.
    const lastEventId = (lastCondition as any).eventId;
    return isNil(lastEventId) ? 0 : lastEventId;
};
