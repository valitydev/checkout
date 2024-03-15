import * as React from 'react';
import { withTheme } from 'styled-components';

import { WithThemeProps } from '../../common/theme';

const WarningIconDef: React.FC<WithThemeProps> = ({ theme }) => (
    <svg fill="none" height="144" id="warning-icon" viewBox="0 0 144 144" width="144">
        <circle cx="72" cy="72" r="70" stroke={theme.icons.warn} strokeWidth="4" />
        <rect fill={theme.icons.warn} height="64" rx="2" width="10" x="67" y="32" />
        <rect fill={theme.icons.warn} height="10" rx="2" width="10" x="67" y="102" />
    </svg>
);

export const WarningIcon = withTheme(WarningIconDef);
