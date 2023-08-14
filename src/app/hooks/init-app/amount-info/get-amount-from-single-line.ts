import isNumber from 'checkout/utils/is-number';
import {
    CostType,
    InvoiceTemplateLineCostFixed,
    InvoiceTemplateLineCostRange,
    InvoiceTemplateSingleLine,
} from 'checkout/backend/model';
import { AmountInfo } from './types';

const getStatus = (configAmount: number) => (isNumber(configAmount) ? 'final' : 'notKnown');

export const getAmountFromSingleLine = (
    details: InvoiceTemplateSingleLine,
    configAmount: number,
    locale: string,
): AmountInfo => {
    const price = details.price;
    if (!price) {
        return null;
    }
    switch (price.costType) {
        case CostType.InvoiceTemplateLineCostFixed:
            const fixed = price as InvoiceTemplateLineCostFixed;
            return {
                status: 'final',
                minorValue: fixed.amount,
                currencyCode: fixed.currency,
                locale,
            };
        case CostType.InvoiceTemplateLineCostRange:
            return {
                status: getStatus(configAmount),
                minorValue: configAmount || undefined,
                currencyCode: (price as InvoiceTemplateLineCostRange).currency,
                locale,
            };
        case CostType.InvoiceTemplateLineCostUnlim:
            return {
                status: getStatus(configAmount),
                minorValue: configAmount || undefined,
                currencyCode: 'RUB', // TODO unlim cost type does't support currency
                locale,
            };
    }
};
