import { useEffect, useReducer } from 'react';
import * as Sentry from '@sentry/react';

import { AppConfig, getEnv, getLocale } from 'checkout/backend';
import { InitConfig } from 'checkout/config';
import { Locale } from 'checkout/locale';
import isNil from 'checkout/utils/is-nil';

export type InitialData = {
    initConfig: InitConfig;
    appConfig: AppConfig;
    locale: Locale;
    isSentryInit: boolean;
};

type State =
    | { status: 'LOADING'; data: Partial<InitialData> }
    | { status: 'SUCCESS'; data: InitialData }
    | { status: 'FAILURE'; data: null; error: unknown };

type Action =
    | { type: 'FETCH_LOCALE_SUCCESS'; payload: Locale }
    | { type: 'SENTRY_INIT_SUCCESS' }
    | { type: 'APP_INIT_SUCCESS' }
    | { type: 'APP_INIT_FAILURE'; error: unknown };

const isInitialData = (data: Partial<InitialData>): data is InitialData =>
    !isNil(data.appConfig) && !isNil(data.initConfig) && !isNil(data.locale);

const ERROR_MSG = 'Invalid state';

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
        case 'APP_INIT_SUCCESS':
            if (!isInitialData(state.data)) throw new Error(ERROR_MSG);
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

type InitAppProps = {
    initConfig: InitConfig;
    appConfig: AppConfig;
};

export const useInitializeApp = ({ initConfig, appConfig }: InitAppProps) => {
    const [state, dispatch] = useReducer(dataFetchReducer, {
        status: 'LOADING',
        data: {
            initConfig,
            appConfig,
            isSentryInit: false
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
                dispatch({ type: 'APP_INIT_SUCCESS' });
            } catch (error) {
                dispatch({ type: 'APP_INIT_FAILURE', error });
            }
        };
        init();
    }, []);

    return state;
};
