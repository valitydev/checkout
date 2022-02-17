import { css } from 'checkout/styled-components';
import { ThemeName } from './theme-name';
import { Theme } from './theme';
import { error, neutral, warning } from './common-palettes';

const palette = {
    Eastern: '#2596A1',
    EasternBlue: '#28acba',
    Emarald: '#06AA87',
    MonteCarlo: '#7cceb7',
    Elephant: '#0F253D',
    Roman: '#DC5A53',
    White: '#fff'
};

const theme: Theme = {
    name: ThemeName.eastern,
    color: {
        neutral,
        primary: {
            1: palette.Eastern, // Payment methods list hover, pay button
            1.1: palette.EasternBlue, // Button hover
            1.2: palette.EasternBlue // Button on click, chevron hover
        },
        secondary: {
            0.9: palette.Eastern, // Payment methods list
            1: palette.Eastern, // Unused
            1.1: palette.EasternBlue // All payments method hover
        },
        error,
        warning,
        info: {},
        success: {
            1: palette.Emarald
        },
        focus: {
            1: palette.Eastern
        },
        font: {
            infoBlock: palette.White
        },
        iconBackgrounds: ['#B25AC3', '#54CB59', '#38C1CD', '#5B9FFF', '#CAC557']
    },
    gradients: {
        form: css`linear-gradient(45deg, ${palette.Eastern} -20%, ${palette.Emarald} 90%)`,
        loader: [
            [palette.MonteCarlo, '0%'],
            [palette.Eastern, '100%']
        ]
    },
    font: {
        family: "'Roboto', sans-serif"
    },
    background: {
        image: false,
        color: css`linear-gradient(225deg, ${palette.Elephant} 0%, ${palette.Roman} 50%, ${palette.Elephant} 100%)`
    }
};

export default theme;
