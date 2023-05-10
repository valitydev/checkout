import { call, CallEffect, select } from 'redux-saga/effects';
import { InitConfig } from 'checkout/config';
import { State } from 'checkout/state';
import { createInvoiceWithTemplate } from './create-invoice-with-template';
import { Invoice, InvoiceTemplate } from 'checkout/backend';
import { AmountInfo, Model } from 'checkout/hooks';

type Effects = CallEffect | InvoiceAndToken;

interface InvoiceAndToken {
    invoice: Invoice;
    invoiceAccessToken: string;
}

export function* createInvoice(
    initConfig: InitConfig,
    endpoint: string,
    invoiceTemplate: InvoiceTemplate,
    amountInfo: AmountInfo,
    formAmount: string
) {
    const { invoiceTemplateAccessToken } = initConfig;
    yield call(
        createInvoiceWithTemplate,
        endpoint,
        invoiceTemplateAccessToken,
        invoiceTemplate,
        amountInfo,
        formAmount
    );
    const { invoice, invoiceAccessToken } = yield select((s: State) => ({
        invoice: s.model.invoice,
        invoiceAccessToken: s.model.invoiceAccessToken
    }));
    return { invoice, invoiceAccessToken };
}

export function* getPayableInvoice(
    initConfig: InitConfig,
    endpoint: string,
    model: Model,
    amountInfo: AmountInfo,
    formAmount: string
): Iterator<Effects> {
    const { invoice, invoiceTemplate, invoiceAccessToken } = model;
    if (invoice && (amountInfo.minorValue ? invoice.amount === amountInfo.minorValue : true)) {
        return { invoice, invoiceAccessToken };
    }
    if (invoiceTemplate) {
        return yield call(createInvoice, initConfig as any, endpoint, invoiceTemplate, amountInfo, formAmount);
    }
    throw { code: 'error.inconsistent.model' };
}
