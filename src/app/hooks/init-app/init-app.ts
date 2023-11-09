import { getLocale } from 'checkout/backend';
import { InitParams } from 'checkout/initialize';

import { getAmountInfo } from './amount-info';
import { fetchModel } from './fetch-model';
import { initAvailablePaymentMethods } from './init-available-payment-methods';
import { InitialData } from './types';

export const initApp = async ({ initConfig, appConfig, origin }: InitParams): Promise<InitialData> => {
    const [locale, model] = await Promise.all([
        getLocale(initConfig.locale),
        fetchModel(appConfig.capiEndpoint, initConfig),
    ]);
    const amountInfo = getAmountInfo(initConfig, model);
    const availablePaymentMethods = initAvailablePaymentMethods(initConfig, model);
    return {
        initConfig,
        appConfig,
        origin,
        locale,
        model,
        amountInfo,
        availablePaymentMethods,
    };
};
