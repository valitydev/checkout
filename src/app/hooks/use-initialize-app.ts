import { useEffect, useReducer } from 'react';

import { AppConfig, getLocale } from 'checkout/backend';
import { InitConfig } from 'checkout/config';
import { Locale } from 'checkout/locale';
import isNil from 'checkout/utils/is-nil';
import { fetchModel, InitModelParams, Model } from './fetch-model';

import { AmountInfo, getAmountInfo } from './amount-info';
import { PaymentMethod } from './init-available-payment-methods';
import { initAvailablePaymentMethods } from './init-available-payment-methods';
import { InitParams } from 'checkout/initialize';

export type InitialData = {
    initConfig: InitConfig;
    appConfig: AppConfig;
    locale: Locale;
    model: Model;
    amountInfo: AmountInfo;
    availablePaymentMethods: PaymentMethod[];
    origin: string;
};

type State =
    | { status: 'LOADING'; data: Partial<InitialData> }
    | { status: 'SUCCESS'; data: InitialData }
    | { status: 'FAILURE'; data: null; error: unknown };

type Action =
    | { type: 'FETCH_LOCALE_SUCCESS'; payload: Locale }
    | { type: 'FETCH_MODEL_SUCCESS'; payload: Model }
    | { type: 'SET_AMOUNT_INFO'; payload: AmountInfo }
    | { type: 'SET_AVAILABLE_PAYMENT_METHODS'; payload: PaymentMethod[] }
    | { type: 'APP_INIT_SUCCESS' }
    | { type: 'APP_INIT_FAILURE'; error: unknown };

const isInitialData = (data: Partial<InitialData>): data is InitialData =>
    Object.values(data).filter(isNil).length === 0;

const dataFetchReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_LOCALE_SUCCESS':
            return {
                ...state,
                data: {
                    ...state.data,
                    locale: action.payload
                },
                status: 'LOADING'
            };
        case 'FETCH_MODEL_SUCCESS':
            return {
                ...state,
                data: {
                    ...state.data,
                    model: action.payload
                },
                status: 'LOADING'
            };
        case 'SET_AMOUNT_INFO':
            return {
                ...state,
                data: {
                    ...state.data,
                    amountInfo: action.payload
                },
                status: 'LOADING'
            };
        case 'SET_AVAILABLE_PAYMENT_METHODS':
            return {
                ...state,
                data: {
                    ...state.data,
                    availablePaymentMethods: action.payload
                },
                status: 'LOADING'
            };
        case 'APP_INIT_SUCCESS':
            if (!isInitialData(state.data)) throw new Error('Invalid state');
            return {
                ...state,
                status: 'SUCCESS',
                data: state.data
            };
        case 'APP_INIT_FAILURE':
            return {
                ...state,
                status: 'FAILURE',
                error: action.error,
                data: null
            };
    }
};

const toInitModelParams = (initConfig: InitConfig): InitModelParams => {
    if (initConfig.integrationType === 'invoice' || initConfig.integrationType === 'invoiceTemplate') {
        return initConfig as InitModelParams;
    }
    throw new Error('Incorrect init config');
};

export const useInitializeApp = ({ initConfig, appConfig, origin }: InitParams) => {
    const [state, dispatch] = useReducer(dataFetchReducer, {
        status: 'LOADING',
        data: {
            initConfig,
            appConfig,
            origin,
            locale: null,
            model: null,
            amountInfo: null,
            availablePaymentMethods: null
        }
    });

    useEffect(() => {
        const init = async () => {
            try {
                const locale = await getLocale(initConfig.locale);
                dispatch({ type: 'FETCH_LOCALE_SUCCESS', payload: locale });
                const model = await fetchModel(appConfig.capiEndpoint, toInitModelParams(initConfig));
                dispatch({ type: 'FETCH_MODEL_SUCCESS', payload: model });
                const amountInfo = getAmountInfo(initConfig, model);
                dispatch({ type: 'SET_AMOUNT_INFO', payload: amountInfo });
                const availablePaymentMethods = initAvailablePaymentMethods(
                    initConfig,
                    model.paymentMethods,
                    model.serviceProviders
                );
                dispatch({ type: 'SET_AVAILABLE_PAYMENT_METHODS', payload: availablePaymentMethods });
                dispatch({ type: 'APP_INIT_SUCCESS' });
            } catch (error) {
                dispatch({ type: 'APP_INIT_FAILURE', error });
                console.error('APP_INIT_FAILURE', error);
            }
        };
        init();
    }, []);

    return state;
};
