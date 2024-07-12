import { css } from 'styled-components';

import { ThemeName, Theme } from './types';

const palette = {
    Mustard: '#FFDB57',
    Aztec: '#081514',
    GableGreen: '#163735',
    William: '#386460',
    LightningYellow: '#ffc81e',
    Flamenco: '#ff7808',
    AthensGray: '#F9FAFB',
    Zeus: '#110E0B',
    Loblolly: '#C3CED6',
    RegentGray: '#87939B',
    CopperRose: '#A17171',
    Cinnabar: '#E75542',
    SeaNymph: '#71A19D',
    BlueRibbon: '#0038FF',
    Candlelight: '#ffe05c',
    Silver: '#979797',
    Orange: '#ffe484',
};

const theme: Theme = {
    name: ThemeName.plantation,
    font: {
        family: "'Roboto', sans-serif",
        primaryColor: palette.Zeus,
    },
    background: {
        gradient: css`linear-gradient(30deg, ${palette.Aztec} 0%, ${palette.GableGreen} 50%, ${palette.William} 100%)`,
        loader: [
            [palette.Flamenco, '0%'],
            [palette.Mustard, '100%'],
        ],
    },
    form: {
        background: palette.AthensGray,
        border: palette.Loblolly,
    },
    input: {
        backgroundColor: 'none',
        border: palette.Loblolly,
        color: '#000000',
        placeholder: palette.RegentGray,
        error: palette.Cinnabar,
        focus: palette.Zeus,
    },
    icons: {
        success: palette.SeaNymph,
        error: palette.CopperRose,
        warn: palette.Candlelight,
        checkmark: palette.SeaNymph,
    },
    divider: palette.Loblolly,
    externalLink: palette.BlueRibbon,
    paymentMethodItem: {
        border: palette.Loblolly,
        hover: palette.Zeus,
        color: palette.Zeus,
        error: palette.Cinnabar,
    },
    chevronButton: {
        color: palette.Zeus,
        disabled: palette.Silver,
    },
    button: {
        primaryText: palette.Zeus,
        outlineText: palette.Zeus,
        color: palette.Mustard,
        hover: palette.LightningYellow,
    },
    linkButton: {
        color: palette.Zeus,
        hover: palette.Zeus,
    },
    alert: {
        background: palette.Orange,
    },
};

export default theme;
