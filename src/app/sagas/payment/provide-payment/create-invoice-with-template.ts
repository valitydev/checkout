import { call, CallEffect, put, PutEffect } from 'redux-saga/effects';
import { InvoiceTemplate, createInvoiceWithTemplate as request, InvoiceAndToken } from 'checkout/backend';
import { InvoiceCreated, TypeKeys } from 'checkout/actions';
import { toMinorAmount } from 'checkout/utils';
import { AmountInfo } from 'checkout/hooks/amount-info';

export type Effects = CallEffect | PutEffect<InvoiceCreated>;

export const getAmount = (amountInfo: AmountInfo, formAmount: string): number => {
    switch (amountInfo.status) {
        case 'final':
            return amountInfo.minorValue;
        case 'notKnown':
            return toMinorAmount(formAmount);
    }
};

export function* createInvoiceWithTemplate(
    endpoint: string,
    token: string,
    template: InvoiceTemplate,
    amountInfo: AmountInfo,
    formAmount: string
): Iterator<Effects> {
    const params = {
        amount: getAmount(amountInfo, formAmount),
        metadata: template.metadata,
        currency: amountInfo.currencyCode
    };
    const { invoice, invoiceAccessToken }: InvoiceAndToken = yield call(request, endpoint, token, template.id, params);
    return yield put({
        type: TypeKeys.INVOICE_CREATED,
        payload: {
            invoice,
            invoiceAccessToken: invoiceAccessToken.payload
        }
    } as InvoiceCreated);
}
