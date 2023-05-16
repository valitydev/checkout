import { useContext, useState, useEffect } from 'react';

import isNil from 'checkout/utils/is-nil';
import { PaymentRequestedPayload } from 'checkout/actions';
import { PaymentMethodName } from 'checkout/backend';
import { useCreateInvoiceWithTemplate } from 'checkout/hooks';
import { PayableFormValues } from 'checkout/state';

import { PayableInvoiceContext } from '../../payable-invoice-context';
import { InitialContext } from '../../../initial-context';

export const usePreparePayableData = (): [PaymentRequestedPayload, any] => {
    const { initConfig, appConfig, model, amountInfo, origin } = useContext(InitialContext);
    const [submitData, setSubmitData] = useState<{ method: PaymentMethodName; values?: PayableFormValues }>(null);
    const [prepared, setPrepared] = useState<PaymentRequestedPayload>(null);
    const { state, create } = useCreateInvoiceWithTemplate();
    const { payableInvoiceData, setPayableInvoiceData } = useContext(PayableInvoiceContext);

    useEffect(() => {
        if (isNil(submitData)) return;
        if (isNil(payableInvoiceData)) {
            switch (state.status) {
                case 'PRISTINE':
                    create({
                        capiEndpoint: appConfig.capiEndpoint,
                        invoiceTemplateAccessToken: initConfig.invoiceTemplateAccessToken,
                        invoiceTemplate: model.invoiceTemplate,
                        amount: {
                            amountInfo,
                            formAmount: submitData.values?.amount
                        }
                    });
                    break;
                case 'SUCCESS':
                    setPayableInvoiceData({
                        invoiceID: state.data.invoice.id,
                        invoiceAccessToken: state.data.invoiceAccessToken.payload
                    });
                    break;
            }
            return;
        }
        setPrepared({
            ...submitData,
            context: {
                initConfig,
                appConfig,
                origin,
                amountInfo,
                model
            }
        });
    }, [submitData, payableInvoiceData, state]);

    return [prepared, setSubmitData];
};
