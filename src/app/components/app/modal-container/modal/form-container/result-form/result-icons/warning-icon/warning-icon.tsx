import * as React from 'react';
import { withTheme } from 'checkout/styled-components';
import { WithThemeProps } from 'checkout/themes';

const WarningIconDef: React.FC<WithThemeProps> = ({ theme }) => (
    <svg width="144" height="144" viewBox="0 0 144 144" fill="none">
        <circle cx="72" cy="72" r="70" stroke={theme.icons.warn} strokeWidth="4" />
        <rect x="67" y="32" width="10" height="64" rx="2" fill={theme.icons.warn} />
        <rect x="67" y="102" width="10" height="10" rx="2" fill={theme.icons.warn} />
    </svg>
);

export const WarningIcon = withTheme(WarningIconDef);
