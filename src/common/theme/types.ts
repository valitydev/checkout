import { css } from 'styled-components';

export enum ThemeName {
    plantation = 'plantation',
    rhino = 'rhino',
}

export type Theme = {
    name: ThemeName;
    font: {
        family: string;
        primaryColor: string;
    };
    background: {
        gradient: ReturnType<typeof css>;
        loader: string[][];
    };
    form: {
        background: string;
        border: string;
    };
    input: {
        backgroundColor: string;
        border: string;
        color: string;
        placeholder: string;
        error: string;
        focus: string;
    };
    icons: {
        success: string;
        error: string;
        warn: string;
        checkmark: string;
    };
    divider: string;
    externalLink: string;
    paymentMethodItem: {
        border: string;
        hover: string;
        color: string;
        error: string;
    };
    chevronButton: {
        color: string;
        disabled: string;
    };
    button: {
        primaryText: string;
        outlineText: string;
        color: string;
        hover: string;
    };
    linkButton: {
        color: string;
        hover: string;
    };
    alert: {
        background: string;
    };
};
