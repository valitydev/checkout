import { useMemo } from 'react';
import { getTheme } from 'checkout/themes';

export const useTheme = (fixedThemeName: string, initThemeName: string | null) =>
    useMemo(() => getTheme(initThemeName || fixedThemeName), []);
