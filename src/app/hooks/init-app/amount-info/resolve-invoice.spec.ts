import { resolveInvoice } from './resolve-invoice';

it('should return amount', () => {
    const invoice = {
        amount: 10000,
        currency: 'RUB',
    } as any;
    const actual = resolveInvoice(invoice, 'ru');
    const expected = {
        status: 'final',
        currencyCode: 'RUB',
        minorValue: 10000,
        locale: 'ru',
    };
    expect(actual).toEqual(expected);
});
