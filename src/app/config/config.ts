import { AppConfig } from '../backend';
import { InitConfig } from './init-config';
import { Locale } from 'checkout/locale';

export class Config {
    initConfig: InitConfig;
    appConfig?: AppConfig;
    locale?: Locale;
}
