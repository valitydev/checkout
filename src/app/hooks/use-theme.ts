import { useMemo } from 'react';

import { InitParams } from 'checkout/initialize';
import { getTheme } from 'checkout/themes';

export const useTheme = ({ appConfig, initConfig }: InitParams) => {
    const fixedThemeName = appConfig.fixedTheme;
    const initThemeName = initConfig.theme;
    return useMemo(() => getTheme(initThemeName || fixedThemeName), []);
};
