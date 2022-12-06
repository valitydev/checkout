import { css } from 'checkout/styled-components';
import { ThemeName } from './theme-name';

export interface Theme {
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
        border: string;
        placeholder: string;
        error: string;
        focus: string;
    };
    select: {
        border: string;
        placeholder: string;
        error: string;
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
    chevronBack: {
        color: string;
        hover: string;
    };
    button: {
        text: string;
        color: string;
        hover: string;
    };
    linkButton: {
        color: string;
        hover: string;
    };
}
