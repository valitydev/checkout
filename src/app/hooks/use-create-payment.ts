import { useContext, useCallback, useReducer } from 'react';

import isNil from 'checkout/utils/is-nil';
import { PaymentRequestedPayload } from 'checkout/actions';
import { createInvoiceWithTemplate, createPayment } from './create-payment';
import { FormData } from './create-payment';

import { InitialContext } from '../components/app/initial-context';
import { PayableInvoiceContext } from '../components/app/modal-container/payable-invoice-context';

type State =
    | { status: 'PRISTINE' }
    | { status: 'SUCCESS'; data: PaymentRequestedPayload }
    | { status: 'FAILURE'; error: unknown };

type Action =
    | { type: 'CREATE_PAYMENT_SUCCESS'; payload: PaymentRequestedPayload }
    | { type: 'CREATE_PAYMENT_FAILURE'; error: unknown };

const dataReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'CREATE_PAYMENT_SUCCESS':
            return {
                ...state,
                status: 'SUCCESS',
                data: action.payload
            };
        case 'CREATE_PAYMENT_FAILURE':
            return {
                ...state,
                status: 'FAILURE',
                error: action.error
            };
    }
};

export const useCreatePayment = () => {
    const {
        initConfig,
        appConfig,
        model: { invoiceTemplate, serviceProviders },
        amountInfo,
        origin
    } = useContext(InitialContext);
    const { payableInvoiceData, setPayableInvoiceData } = useContext(PayableInvoiceContext);

    const [createPaymentState, dispatch] = useReducer(dataReducer, {
        status: 'PRISTINE'
    });

    const setFormData = useCallback(
        (formData: FormData) => {
            const fetchData = async () => {
                try {
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
                    const payload = {
                        capiEndpoint: appConfig.capiEndpoint,
                        invoiceID: data.invoice.id,
                        invoiceAccessToken: data.invoiceAccessToken,
                        serviceProviders
                    };
                    dispatch({ type: 'CREATE_PAYMENT_SUCCESS', payload });
                } catch (error) {
                    dispatch({ type: 'CREATE_PAYMENT_FAILURE', error });
                    console.error('Create payment failure', error);
                }
            };
            fetchData();
        },
        [payableInvoiceData]
    );

    return { createPaymentState, setFormData };
};
