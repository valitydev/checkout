import {
    AppConfig,
    Invoice,
    InvoiceTemplate,
    ServiceProvider,
    PaymentMethod as ApiPaymentMethod,
} from 'checkout/backend';
import { InitConfig } from 'checkout/config';
import { Locale } from 'checkout/locale';

import { AmountInfo } from './amount-info';
import { PaymentMethod } from './init-available-payment-methods';

export type Model = {
    invoiceTemplate?: InvoiceTemplate;
    paymentMethods?: ApiPaymentMethod[];
    invoiceAccessToken?: string;
    invoice?: Invoice;
    serviceProviders?: ServiceProvider[];
};

export type InitialData = {
    initConfig: InitConfig;
    appConfig: AppConfig;
    locale: Locale;
    model: Model;
    amountInfo: AmountInfo;
    availablePaymentMethods: PaymentMethod[];
    origin: string;
};

export * from './amount-info/types';
export * from './init-available-payment-methods/types';
