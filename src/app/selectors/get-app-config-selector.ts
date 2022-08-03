import { AppConfig } from 'checkout/backend';
import { State } from 'checkout/state';

export const getAppConfigSelector = (s: State): AppConfig => s.config.appConfig;
