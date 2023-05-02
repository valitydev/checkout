import { useMemo } from 'react';
import { getTheme } from 'checkout/themes';
import { InitParams } from 'checkout/initialize';

export const useTheme = ({ appConfig, initConfig }: InitParams) => {
    const fixedThemeName = appConfig.fixedTheme;
    const initThemeName = initConfig.theme;
    return useMemo(() => getTheme(initThemeName || fixedThemeName), []);
};
