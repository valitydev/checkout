import { ThemeName } from 'checkout/themes';

export class AppConfig {
    capiEndpoint: string;
    wrapperEndpoint: string;
    brandless: boolean;
    fixedTheme: ThemeName;
    brandName: string;
    urlShortenerEndpoint: string;
    sentryDsn: string;
}
