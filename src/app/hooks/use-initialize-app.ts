import { useEffect, useReducer } from 'react';
import * as Sentry from '@sentry/react';

import { AppConfig, getEnv, getLocale } from 'checkout/backend';
import { InitConfig, IntegrationType } from 'checkout/config';
import { Locale } from 'checkout/locale';
import isNil from 'checkout/utils/is-nil';
import { fetchModel, InitModelParams, Model } from './fetch-model';

import { AmountInfo, getAmountInfo } from './amount-info';
import { PaymentMethod } from './init-available-payment-methods';
import { initAvailablePaymentMethods } from './init-available-payment-methods';
import { getOrigin } from '../../get-origin';

export type InitialData = {
    initConfig: InitConfig;
    appConfig: AppConfig;
    locale: Locale;
    isSentryInit: boolean;
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
    | { type: 'SENTRY_INIT_SUCCESS' }
    | { type: 'FETCH_MODEL_SUCCESS'; payload: Model }
    | { type: 'SET_AMOUNT_INFO'; payload: AmountInfo }
    | { type: 'SET_AVAILABLE_PAYMENT_METHODS'; payload: PaymentMethod[] }
    | { type: 'APP_INIT_SUCCESS' }
    | { type: 'APP_INIT_FAILURE'; error: unknown }
    | { type: 'SET_ORIGIN'; payload: string };

type InitAppProps = {
    initConfig: InitConfig;
    appConfig: AppConfig;
};

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
        case 'SENTRY_INIT_SUCCESS':
            return {
                ...state,
                data: {
                    ...state.data,
                    isSentryInit: true
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
        case 'SET_ORIGIN':
            return {
                ...state,
                data: {
                    ...state.data,
                    origin: action.payload
                },
                status: 'LOADING'
            };
    }
};

const initSentry = async (dsn: string) => {
    const env = await getEnv();
    Sentry.init({
        environment: 'production',
        dsn,
        integrations: [new Sentry.BrowserTracing()],
        tracesSampleRate: 0.1,
        release: env.version
    });
};

const toInitModelParams = (initConfig: InitConfig): InitModelParams => {
    if (
        initConfig.integrationType === IntegrationType.invoice ||
        initConfig.integrationType === IntegrationType.invoiceTemplate
    ) {
        return initConfig as InitModelParams;
    }
    throw new Error('Incorrect init config');
};

export const useInitializeApp = ({ initConfig, appConfig }: InitAppProps) => {
    const [state, dispatch] = useReducer(dataFetchReducer, {
        status: 'LOADING',
        data: {
            initConfig,
            appConfig,
            isSentryInit: false,
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
                if (appConfig.sentryDsn) {
                    await initSentry(appConfig.sentryDsn);
                    dispatch({ type: 'SENTRY_INIT_SUCCESS' });
                }
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
                dispatch({ type: 'SET_ORIGIN', payload: getOrigin() });
                dispatch({ type: 'APP_INIT_SUCCESS' });
            } catch (error) {
                dispatch({ type: 'APP_INIT_FAILURE', error });
            }
        };
        init();
    }, []);

    return state;
};
