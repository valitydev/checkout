import { InvoiceAndToken, InvoiceTemplate, createInvoiceWithTemplate as request } from 'checkout/backend';
import { toMinorAmount } from 'checkout/utils';

import { PayableInvoiceData } from './types';
import { AmountInfo } from '../init-app';

const getAmount = (amountInfo: AmountInfo, formAmount: string): number => {
    switch (amountInfo.status) {
        case 'final':
            return amountInfo.minorValue;
        case 'notKnown':
            return toMinorAmount(formAmount);
    }
};

const toPayableInvoiceData = ({
    invoice: { id, dueDate, externalID },
    invoiceAccessToken,
}: InvoiceAndToken): PayableInvoiceData => ({
    invoice: { id, dueDate, externalID },
    invoiceAccessToken: invoiceAccessToken.payload,
});

export type CreateInvoiceParams = {
    capiEndpoint: string;
    invoiceTemplateAccessToken: string;
    invoiceTemplate: InvoiceTemplate;
    amountInfo: AmountInfo;
    formAmount: string;
};

export const createInvoiceWithTemplate = async ({
    capiEndpoint,
    invoiceTemplateAccessToken,
    invoiceTemplate: { metadata, id },
    amountInfo,
    formAmount,
}: CreateInvoiceParams): Promise<PayableInvoiceData> => {
    const params = {
        amount: getAmount(amountInfo, formAmount),
        metadata,
        currency: amountInfo.currencyCode,
    };
    const invoiceAndToken = await request(capiEndpoint, invoiceTemplateAccessToken, id, params);
    return toPayableInvoiceData(invoiceAndToken);
};
