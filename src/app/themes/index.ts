import plantation from './plantation';
import rhino from './rhino';
import { Theme } from './theme';

const themes = [plantation, rhino];

export const DEFAULT_THEME = plantation;

export interface WithThemeProps {
    theme: Theme;
}

export function getTheme(themeName: string): Theme {
    return themes.find(({ name }) => name === themeName) || DEFAULT_THEME;
}

export * from './theme';
export * from './theme-name';
