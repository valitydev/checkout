import { useCallback, useReducer } from 'react';

import isNil from 'checkout/utils/is-nil';
import { InvoiceAndToken, InvoiceTemplate, createInvoiceWithTemplate } from 'checkout/backend';
import { toMinorAmount } from 'checkout/utils';

import { PayableInvoiceData } from './types';
import { AmountInfo } from './init-app';

type State =
    | { status: 'PRISTINE' }
    | { status: 'LOADING' }
    | { status: 'INVOICE_REQUIRED' }
    | { status: 'READY'; data: PayableInvoiceData }
    | { status: 'FAILURE'; data: null; error: unknown };

type Action =
    | { type: 'SET_DATA_FROM_CONTEXT'; payload: PayableInvoiceData }
    | { type: 'SET_EMPTY_DATA_FROM_CONTEXT' }
    | { type: 'FETCH_INIT' }
    | { type: 'FETCH_SUCCESS'; payload: PayableInvoiceData }
    | { type: 'FETCH_FAILURE'; error: unknown };

const dataReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_DATA_FROM_CONTEXT':
            return {
                ...state,
                status: 'READY',
                data: action.payload
            };
        case 'SET_EMPTY_DATA_FROM_CONTEXT':
            return {
                ...state,
                status: 'INVOICE_REQUIRED',
                data: null
            };
        case 'FETCH_INIT':
            return {
                ...state,
                status: 'LOADING'
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                status: 'READY',
                data: action.payload
            };
        case 'FETCH_FAILURE':
            return {
                ...state,
                status: 'FAILURE',
                error: action.error,
                data: null
            };
    }
};

const getAmount = (amountInfo: AmountInfo, formAmount: string): number => {
    switch (amountInfo.status) {
        case 'final':
            return amountInfo.minorValue;
        case 'notKnown':
            return toMinorAmount(formAmount);
    }
};

const toPayableInvoiceData = ({ invoice, invoiceAccessToken }: InvoiceAndToken): PayableInvoiceData => ({
    invoiceID: invoice.id,
    invoiceAccessToken: invoiceAccessToken.payload
});

export type Params = {
    capiEndpoint: string;
    invoiceTemplateAccessToken: string;
    invoiceTemplate: InvoiceTemplate;
    amountInfo: AmountInfo;
};

export const usePreparePayableInvoice = ({
    capiEndpoint,
    invoiceTemplateAccessToken,
    invoiceTemplate: { metadata, id },
    amountInfo
}: Params) => {
    const [state, dispatch] = useReducer(dataReducer, {
        status: 'PRISTINE'
    });

    const init = useCallback((payableInvoiceData: PayableInvoiceData | null) => {
        isNil(payableInvoiceData)
            ? dispatch({ type: 'SET_EMPTY_DATA_FROM_CONTEXT' })
            : dispatch({ type: 'SET_DATA_FROM_CONTEXT', payload: payableInvoiceData });
    }, []);

    const createInvoiceFromTemplate = useCallback((formAmount: string) => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_INIT' });
            try {
                const params = {
                    amount: getAmount(amountInfo, formAmount),
                    metadata,
                    currency: amountInfo.currencyCode
                };
                const invoiceAndToken = await createInvoiceWithTemplate(
                    capiEndpoint,
                    invoiceTemplateAccessToken,
                    id,
                    params
                );
                const data = toPayableInvoiceData(invoiceAndToken);
                dispatch({ payload: data, type: 'FETCH_SUCCESS' });
            } catch (error) {
                dispatch({ error, type: 'FETCH_FAILURE' });
            }
        };
        fetchData();
    }, []);

    return { state, init, createInvoiceFromTemplate };
};
