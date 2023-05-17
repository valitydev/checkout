import { useContext, useState, useEffect } from 'react';

import isNil from 'checkout/utils/is-nil';
import { PaymentRequestedPayload } from 'checkout/actions';
import { PaymentMethodName } from 'checkout/backend';
import { usePreparePayableInvoice } from 'checkout/hooks';
import { PayableFormValues } from 'checkout/state';

import { InitialContext } from '../../../initial-context';
import { PayableInvoiceContext } from '../../payable-invoice-context';

export const usePreparePayableData = (): [PaymentRequestedPayload, any] => {
    const { initConfig, appConfig, model, amountInfo, origin } = useContext(InitialContext);
    const { payableInvoiceData, setPayableInvoiceData } = useContext(PayableInvoiceContext);

    const [submitData, setSubmitData] = useState<{ method: PaymentMethodName; values?: PayableFormValues }>(null);
    const [prepared, setPrepared] = useState<PaymentRequestedPayload>(null);

    const { state, init, createInvoiceFromTemplate } = usePreparePayableInvoice({
        capiEndpoint: appConfig.capiEndpoint,
        invoiceTemplateAccessToken: initConfig.invoiceTemplateAccessToken,
        invoiceTemplate: model.invoiceTemplate,
        amountInfo: amountInfo
    });

    useEffect(() => {
        if (state.status === 'PRISTINE') {
            init(payableInvoiceData);
        }
    }, [state]);

    useEffect(() => {
        if (isNil(submitData)) return;
        switch (state.status) {
            case 'INVOICE_REQUIRED':
                createInvoiceFromTemplate(submitData.values?.amount);
                break;
            case 'READY':
                const data = state.data;
                setPayableInvoiceData(data);
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
                break;
        }
    }, [submitData, state]);

    return [prepared, setSubmitData];
};
