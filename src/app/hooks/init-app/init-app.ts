import { getLocale } from 'checkout/backend';
import { fetchModel } from './fetch-model';
import { getAmountInfo } from './amount-info';
import { initAvailablePaymentMethods } from './init-available-payment-methods';
import { InitParams } from 'checkout/initialize';
import { InitialData } from './types';

export const initApp = async ({ initConfig, appConfig, origin }: InitParams): Promise<InitialData> => {
    const locale = await getLocale(initConfig.locale);
    const model = await fetchModel(appConfig.capiEndpoint, initConfig);
    const amountInfo = getAmountInfo(initConfig, model);
    const availablePaymentMethods = initAvailablePaymentMethods(initConfig, model);
    return {
        initConfig,
        appConfig,
        origin,
        locale,
        model,
        amountInfo,
        availablePaymentMethods
    };
};