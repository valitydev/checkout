import { getAmountFromSingleLine } from './get-amount-from-single-line';

it('InvoiceTemplateLineCostFixed should return amount', () => {
    const singleLine = {
        price: {
            costType: 'InvoiceTemplateLineCostFixed',
            amount: 149900,
            currency: 'RUB'
        }
    } as any;
    const actual = getAmountFromSingleLine(singleLine, 111, 'ru');
    const expected = {
        status: 'final',
        currencyCode: 'RUB',
        locale: 'ru',
        minorValue: 149900
    };
    expect(actual).toEqual(expected);
});

describe('InvoiceTemplateLineCostRange', () => {
    const singleLine = {
        price: {
            costType: 'InvoiceTemplateLineCostRange',
            range: {
                lowerBound: 1000,
                upperBound: 2000
            },
            currency: 'RUB'
        }
    } as any;

    it('with amountConfig should return final status', () => {
        const actual = getAmountFromSingleLine(singleLine, 111, 'ru');
        const expected = {
            status: 'final',
            currencyCode: 'RUB',
            minorValue: 111,
            locale: 'ru'
        };
        expect(actual).toEqual(expected);
    });

    it('without amountConfig should return notKnown status', () => {
        const actual = getAmountFromSingleLine(singleLine, null, 'ru');
        const expected = {
            status: 'notKnown',
            currencyCode: 'RUB',
            locale: 'ru',
            minorValue: undefined
        };
        expect(actual).toEqual(expected);
    });
});

describe('InvoiceTemplateLineCostUnlim', () => {
    const singleLine = {
        price: {
            costType: 'InvoiceTemplateLineCostUnlim'
        }
    } as any;

    it('with amountConfig should return final status', () => {
        const actual = getAmountFromSingleLine(singleLine, 111, 'ru');
        const expected = {
            status: 'final',
            currencyCode: 'RUB',
            minorValue: 111,
            locale: 'ru'
        };
        expect(actual).toEqual(expected);
    });

    it('without amountConfig should return notKnown status', () => {
        const actual = getAmountFromSingleLine(singleLine, null, 'ru');
        const expected = {
            status: 'notKnown',
            currencyCode: 'RUB',
            locale: 'ru'
        };
        expect(actual).toEqual(expected);
    });
});
