import { State } from 'checkout/state';

export const getInitConfigSelector = (s: State) => s.config.initConfig;
