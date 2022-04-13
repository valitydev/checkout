import { Locale } from 'checkout/locale';
import { State } from 'checkout/state';

export const getLocaleSelector = (s: State): Locale => s.config.locale;
