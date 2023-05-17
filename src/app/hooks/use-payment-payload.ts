import { useContext, useState, useCallback } from 'react';

import isNil from 'checkout/utils/is-nil';
import { PaymentRequestedPayload } from 'checkout/actions';
import { InvoiceAndToken, InvoiceTemplate, PaymentMethodName, createInvoiceWithTemplate } from 'checkout/backend';
import { PayableFormValues } from 'checkout/state';
import { toMinorAmount } from 'checkout/utils';
import { PayableInvoiceData } from './types';
import { AmountInfo } from './init-app';

import { InitialContext } from '../components/app/initial-context';
import { PayableInvoiceContext } from '../components/app/modal-container/payable-invoice-context';

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
    invoiceAccessToken
}: InvoiceAndToken): PayableInvoiceData => ({
    invoice: { id, dueDate, externalID },
    invoiceAccessToken: invoiceAccessToken.payload
});

export type CreateInvoiceParams = {
    capiEndpoint: string;
    invoiceTemplateAccessToken: string;
    invoiceTemplate: InvoiceTemplate;
    amountInfo: AmountInfo;
    formAmount: string;
};

const createPayableInvoiceWithTemplate = async ({
    capiEndpoint,
    invoiceTemplateAccessToken,
    invoiceTemplate: { metadata, id },
    amountInfo,
    formAmount
}: CreateInvoiceParams): Promise<PayableInvoiceData> => {
    const params = {
        amount: getAmount(amountInfo, formAmount),
        metadata,
        currency: amountInfo.currencyCode
    };
    const invoiceAndToken = await createInvoiceWithTemplate(capiEndpoint, invoiceTemplateAccessToken, id, params);
    return toPayableInvoiceData(invoiceAndToken);
};

export type FormData = {
    method: PaymentMethodName;
    values?: PayableFormValues;
};

export const usePaymentPayload = () => {
    const {
        initConfig,
        appConfig,
        model: { invoiceTemplate, serviceProviders },
        amountInfo,
        origin
    } = useContext(InitialContext);

    const { payableInvoiceData, setPayableInvoiceData } = useContext(PayableInvoiceContext);
    const [paymentPayload, setPaymentPayload] = useState<PaymentRequestedPayload>(null);

    const setFormData = useCallback(
        (formData: FormData) => {
            const fetchData = async () => {
                let data = payableInvoiceData;
                if (isNil(data)) {
                    data = await createPayableInvoiceWithTemplate({
                        capiEndpoint: appConfig.capiEndpoint,
                        invoiceTemplateAccessToken: initConfig.invoiceTemplateAccessToken,
                        invoiceTemplate,
                        amountInfo,
                        formAmount: formData.values?.amount
                    });
                    setPayableInvoiceData(data);
                }
                setPaymentPayload({
                    ...formData,
                    context: {
                        initConfig,
                        appConfig,
                        origin,
                        serviceProviders,
                        payableInvoice: data
                    }
                });
            };
            fetchData();
        },
        [payableInvoiceData]
    );

    return { paymentPayload, setFormData };
};
