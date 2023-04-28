import { AmountInfo } from 'checkout/hooks/amount-info';
import toNumber from 'checkout/utils/to-number';

const format = (formAmount: string): string => formAmount.replace(/\s/g, '').replace(/,/g, '.');

export const toMinorAmount = (formAmount: string): number => toNumber(format(formAmount)) * 100;

export const toDisplayAmount = (amountInfo: AmountInfo, formAmount: string): string => {
    switch (amountInfo.status) {
        case 'final':
            return amountInfo.minorValue / 100 + '';
        case 'notKnown':
            return format(formAmount);
    }
};
