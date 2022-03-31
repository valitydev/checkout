import { InvoiceTemplateLineCostRange, InvoiceTemplateLineCostUnlim } from 'checkout/backend';
import { formatAmount } from 'checkout/utils';
import { AmountInfoStatus } from 'checkout/state';

const toUnlimPlaceholder = (localeString: string, currency: string): string => `${localeString} ${currency}`;

const toRangePlaceholder = (cost: InvoiceTemplateLineCostRange, locale: string): string => {
    const range = cost.range;
    const lower = formatAmount({
        minorValue: range.lowerBound,
        currencyCode: cost.currency,
        status: AmountInfoStatus.final,
        locale
    });
    const upper = formatAmount({
        minorValue: range.upperBound,
        currencyCode: cost.currency,
        status: AmountInfoStatus.final,
        locale
    });
    return `${lower} - ${upper}`;
};

export const getPlaceholder = (
    cost: InvoiceTemplateLineCostRange | InvoiceTemplateLineCostUnlim,
    localeString: string,
    localeCode: string
): string => {
    if (!cost) {
        return;
    }
    switch (cost.costType) {
        case 'InvoiceTemplateLineCostUnlim':
            return toUnlimPlaceholder(localeString, 'RUB'); // TODO unlim cost type does't support currency
        case 'InvoiceTemplateLineCostRange':
            return toRangePlaceholder(cost as InvoiceTemplateLineCostRange, localeCode);
    }
};
