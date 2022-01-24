import { ThemeName } from 'checkout/themes';

export class AppConfig {
    capiEndpoint: string;
    wrapperEndpoint: string;
    applePayMerchantID: string;
    samsungPayMerchantName: string;
    samsungPayServiceID: string;
    yandexPay: {
        merchantName: string;
        merchantID: string;
        gatewayMerchantID: string;
    };
    googlePay: {
        merchantName: string;
        merchantID: string;
        gateway: string;
        gatewayMerchantID: string;
        merchantOrigin: string;
    };
    brandless: boolean;
    fixedTheme: ThemeName;
    brandName: string;
}
