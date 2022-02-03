import { Theme } from './theme';
import { ThemeName } from './theme-name';
import main from './main';
import coral from './coral';
import persianGreen from './persian-green';
import solitude from './solitude';
import eastern from './eastern';

const themes = [main, coral, persianGreen, solitude, eastern];

export const DEFAULT_THEME = main;

export interface WithThemeProps {
    theme: Theme;
}

export function getTheme(themeName: ThemeName): Theme {
    return themes.find(({ name }) => name === themeName) || DEFAULT_THEME;
}

export { ThemeName, Theme };
