import { useContext, useState, useCallback } from 'react';

import isNil from 'checkout/utils/is-nil';
import { PaymentRequestedPayload } from 'checkout/actions';
import { createInvoiceWithTemplate, createPayment } from './create-payment';
import { FormData } from './create-payment';

import { InitialContext } from '../components/app/initial-context';
import { PayableInvoiceContext } from '../components/app/modal-container/payable-invoice-context';

export const useCreatePayment = () => {
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
                    data = await createInvoiceWithTemplate({
                        capiEndpoint: appConfig.capiEndpoint,
                        invoiceTemplateAccessToken: initConfig.invoiceTemplateAccessToken,
                        invoiceTemplate,
                        amountInfo,
                        formAmount: formData.values?.amount
                    });
                    setPayableInvoiceData(data);
                }
                await createPayment({
                    capiEndpoint: appConfig.capiEndpoint,
                    urlShortenerEndpoint: appConfig.urlShortenerEndpoint,
                    origin,
                    initConfig: {
                        redirectUrl: initConfig.redirectUrl,
                        email: initConfig.email,
                        phoneNumber: initConfig.phoneNumber,
                        paymentFlowHold: initConfig.paymentFlowHold,
                        holdExpiration: initConfig.holdExpiration,
                        recurring: initConfig.recurring,
                        metadata: initConfig.metadata,
                        isExternalIDIncluded: initConfig.isExternalIDIncluded
                    },
                    formData,
                    payableInvoice: data
                });

                setPaymentPayload({
                    capiEndpoint: appConfig.capiEndpoint,
                    invoiceID: data.invoice.id,
                    invoiceAccessToken: data.invoiceAccessToken,
                    serviceProviders
                });
            };
            fetchData();
        },
        [payableInvoiceData]
    );

    return { paymentPayload, setFormData };
};
