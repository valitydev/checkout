import { Theme } from './theme';
import { ThemeName } from './theme-name';
import plantation from './plantation';

const themes = [plantation];

export const DEFAULT_THEME = plantation;

export interface WithThemeProps {
    theme: Theme;
}

export function getTheme(themeName: ThemeName): Theme {
    return themes.find(({ name }) => name === themeName) || DEFAULT_THEME;
}

export { ThemeName, Theme };
