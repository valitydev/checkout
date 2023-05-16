import { useCallback, useReducer } from 'react';
import { InvoiceAndToken, InvoiceTemplate, createInvoiceWithTemplate } from 'checkout/backend';
import { AmountInfo } from './init-app';
import { toMinorAmount } from 'checkout/utils';

type State =
    | { status: 'PRISTINE' }
    | { status: 'LOADING' }
    | { status: 'SUCCESS'; data: InvoiceAndToken }
    | { status: 'FAILURE'; data: null; error: unknown };

type Action =
    | { type: 'FETCH_INIT' }
    | { type: 'FETCH_SUCCESS'; payload: InvoiceAndToken }
    | { type: 'FETCH_FAILURE'; error: unknown };

const dataReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_INIT':
            return {
                ...state,
                status: 'LOADING'
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                status: 'SUCCESS',
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

export type CreateParams = {
    capiEndpoint: string;
    invoiceTemplate: InvoiceTemplate;
    invoiceTemplateAccessToken: string;
    amount: {
        amountInfo: AmountInfo;
        formAmount?: string;
    };
};

export const useCreateInvoiceWithTemplate = () => {
    const [state, dispatch] = useReducer(dataReducer, {
        status: 'PRISTINE'
    });

    const create = useCallback(
        ({ capiEndpoint, invoiceTemplateAccessToken, invoiceTemplate, amount }: CreateParams) => {
            const fetchData = async () => {
                dispatch({ type: 'FETCH_INIT' });
                try {
                    const params = {
                        amount: getAmount(amount.amountInfo, amount.formAmount),
                        metadata: invoiceTemplate.metadata,
                        currency: amount.amountInfo.currencyCode
                    };
                    const invoiceAndToken = await createInvoiceWithTemplate(
                        capiEndpoint,
                        invoiceTemplateAccessToken,
                        invoiceTemplate.id,
                        params
                    );
                    dispatch({ payload: invoiceAndToken, type: 'FETCH_SUCCESS' });
                } catch (error) {
                    dispatch({ error, type: 'FETCH_FAILURE' });
                }
            };
            fetchData();
        },
        []
    );

    return { state, create };
};
