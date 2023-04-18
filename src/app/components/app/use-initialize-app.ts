import { AppConfig, Env, getAppConfig, getEnv, getLocale } from 'checkout/backend';
import { Config, InitConfig } from 'checkout/config';
import { Locale } from 'checkout/locale';
import { useEffect, useReducer } from 'react';

export type InitialState = {
    initConfig: InitConfig;
    appConfig: AppConfig;
    locale: Locale;
    env: Env;
};

type State =
    | { status: 'INIT' }
    | { status: 'LOADING'; data: Partial<InitialState> }
    | { status: 'SUCCESS'; data: InitialState }
    | { status: 'FAILURE'; error: unknown };

type Action =
    | { type: 'SET_INIT_CONFIG'; payload: InitConfig }
    | { type: 'FETCH_REMOTE_CONFIGS_SUCCESS'; payload: { appConfig: AppConfig; locale: Locale; env: Env } }
    | { type: 'INITIALIZE_SUCCESS' }
    | { type: 'INITIALIZE_FAILURE'; error: unknown };

const dataFetchReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_INIT_CONFIG':
            return {
                ...state,
                data: {
                    initConfig: action.payload
                },
                status: 'LOADING'
            };
        case 'FETCH_REMOTE_CONFIGS_SUCCESS':
            return {
                ...state,
                data: {
                    ...state.data,
                    appConfig: action.payload.appConfig,
                    env: action.payload.env,
                    locale: action.payload.locale
                },
                status: 'LOADING'
            };
        case 'INITIALIZE_SUCCESS':
            return {
                ...state,
                status: 'SUCCESS'
            };
        case 'INITIALIZE_FAILURE':
            return {
                ...state,
                error: action.error,
                status: 'FAILURE'
            };
    }
};

const fetchConfigs = async (localeName: string) => {
    const appConfig = await getAppConfig();
    const env = await getEnv();
    const locale = await getLocale(localeName);
    return { appConfig, env, locale };
};

export const useInitializeApp = ({ initConfig }: Config) => {
    const [state, dispatch] = useReducer(dataFetchReducer, {
        status: 'INIT'
    });

    useEffect(() => {
        dispatch({ payload: initConfig, type: 'SET_INIT_CONFIG' });
        const fetchData = async () => {
            try {
                const configs = await fetchConfigs(initConfig.locale);
                dispatch({ payload: configs, type: 'FETCH_REMOTE_CONFIGS_SUCCESS' });

                dispatch({ type: 'INITIALIZE_SUCCESS' });
            } catch (error) {
                dispatch({ error, type: 'INITIALIZE_FAILURE' });
            }
        };
        fetchData();
    }, []);

    return state;
};
