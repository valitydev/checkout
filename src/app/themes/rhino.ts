import { css } from 'styled-components';

import { Theme } from './theme';
import { ThemeName } from './theme-name';

const palette = {
    CodGray: '#110E0B',
    FlushOrange: '#FF7E00',
    Alabaster: '#F8F8F8',
    SilverChalice: '#AEAEAE',
    RegentGray: '#87939B',
    Cinnabar: '#E75542',
    SeaNymph: '#71A19D',
    CopperRose: '#A17171',
    Candlelight: '#ffe05c',
    BlueRibbon: '#0038FF',
    White: '#FFFFFF',
    Clementine: '#ef7000',
    Gorse: '#fdec4a',
    Rhino: '#33436B',
    BlueCharcoal: '#000C1F',
    Silver: '#979797',
};

const theme: Theme = {
    name: ThemeName.rhino,
    font: {
        family: "'Roboto', sans-serif",
        primaryColor: palette.CodGray,
    },
    background: {
        gradient: css`radial-gradient(75.93% 95.05% at 46.36% 43.35%, ${palette.Rhino} 0%, ${palette.BlueCharcoal} 100%)`,
        loader: [
            [palette.Gorse, '0%'],
            [palette.FlushOrange, '100%'],
        ],
    },
    form: {
        background: palette.Alabaster,
        border: palette.SilverChalice,
    },
    input: {
        border: palette.SilverChalice,
        placeholder: palette.RegentGray,
        error: palette.Cinnabar,
        focus: palette.CodGray,
    },
    icons: {
        success: palette.SeaNymph,
        error: palette.CopperRose,
        warn: palette.Candlelight,
        checkmark: palette.SeaNymph,
    },
    divider: palette.SilverChalice,
    externalLink: palette.BlueRibbon,
    paymentMethodItem: {
        border: palette.SilverChalice,
        hover: palette.CodGray,
        color: palette.CodGray,
        error: palette.Cinnabar,
    },
    chevronButton: {
        color: palette.CodGray,
        disabled: palette.Silver,
    },
    button: {
        primaryText: palette.White,
        outlineText: palette.FlushOrange,
        color: palette.FlushOrange,
        hover: palette.Clementine,
    },
    linkButton: {
        color: palette.CodGray,
        hover: palette.CodGray,
    },
};

export default theme;
