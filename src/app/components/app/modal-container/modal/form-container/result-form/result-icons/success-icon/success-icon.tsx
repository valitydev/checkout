import * as React from 'react';
import { withTheme } from 'styled-components';
import { WithThemeProps } from 'checkout/themes';

const SuccessIconDef: React.FC<WithThemeProps> = ({ theme }) => (
    <svg width="144" height="144" viewBox="0 0 144 144" fill="none" id="success-icon">
        <circle cx="72" cy="72" r="70" stroke={theme.icons.success} strokeWidth="4" />
        <path
            d="M62.9 99.4276C62.119 100.209 60.8527 100.209 60.0716 99.4276L35.9142 75.2702C35.1332 74.4891 35.1332 73.2228 35.9142 72.4417L38.2661 70.0898C39.0472 69.3088 40.3135 69.3088 41.0945 70.0898L60.0716 89.0669C60.8527 89.848 62.119 89.848 62.9 89.0669L106.333 45.6339C107.114 44.8529 108.38 44.8529 109.161 45.6339L111.513 47.9858C112.294 48.7669 112.294 50.0332 111.513 50.8143L62.9 99.4276Z"
            fill={theme.icons.success}
        />
    </svg>
);

export const SuccessIcon = withTheme(SuccessIconDef);
