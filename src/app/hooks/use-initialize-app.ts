import { useEffect, useReducer } from 'react';

import { AppConfig, getLocale } from 'checkout/backend';
import { InitConfig } from 'checkout/config';
import { Locale } from 'checkout/locale';
import { fetchModel, Model } from './fetch-model';
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
    | { status: 'INIT' }
    | { status: 'SUCCESS'; data: InitialData }
    | { status: 'FAILURE'; data: null; error: unknown };

type Action = { type: 'APP_INIT_SUCCESS'; payload: InitialData } | { type: 'APP_INIT_FAILURE'; error: unknown };

const dataFetchReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'APP_INIT_SUCCESS':
            return {
                ...state,
                status: 'SUCCESS',
                data: action.payload
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

export const useInitializeApp = ({ initConfig, appConfig, origin }: InitParams) => {
    const [state, dispatch] = useReducer(dataFetchReducer, {
        status: 'INIT'
    });

    useEffect(() => {
        const init = async () => {
            try {
                const locale = await getLocale(initConfig.locale);
                const model = await fetchModel(appConfig.capiEndpoint, initConfig);
                const amountInfo = getAmountInfo(initConfig, model);
                const availablePaymentMethods = initAvailablePaymentMethods(initConfig, model);
                dispatch({
                    type: 'APP_INIT_SUCCESS',
                    payload: {
                        initConfig,
                        appConfig,
                        origin,
                        locale,
                        model,
                        amountInfo,
                        availablePaymentMethods
                    }
                });
            } catch (error) {
                dispatch({ type: 'APP_INIT_FAILURE', error });
                console.error('Initialize app failure', error);
            }
        };
        init();
    }, []);

    return state;
};
