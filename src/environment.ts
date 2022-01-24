import { Initializer } from './initializer/initializer';

export interface Environment extends Window {
    ValityCheckout?: Configurator;
    ApplePaySession?: ApplePaySession;
    PaymentRequest?: PaymentRequest;
    google?: any;
    YaPay?: YaPay;
}

export interface Configurator {
    configure: (userConfig: any) => Initializer;
}

export const environment = (window as any) as Environment;

export const isApplePayAvailable = (): boolean => {
    try {
        return environment.ApplePaySession && ApplePaySession.canMakePayments();
    } catch (e) {
        console.warn('[ValityCheckout] apple pay availability', e);
        return false;
    }
};

export const isGooglePaymentClientAvailable = (): boolean =>
    !!environment.google && !!environment.google.payments.api.PaymentsClient;

export const isPaymentRequestAvailable = (): boolean => !!environment.PaymentRequest;

export const isYandexPayAvailable = (): boolean => !!environment.YaPay;
