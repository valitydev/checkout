import * as React from 'react';
import { withTheme } from 'styled-components';

import { WithThemeProps } from 'checkout/themes';

const ErrorIconDef: React.FC<WithThemeProps> = ({ theme }) => (
    <svg fill="none" height="144" id="error-icon" viewBox="0 0 144 144" width="144">
        <circle cx="72" cy="72" r="70" stroke={theme.icons.error} strokeWidth="4" />
        <path
            d="M47.4263 101.298C46.6453 102.079 45.3789 102.079 44.5979 101.298L42.7013 99.4018C41.9203 98.6208 41.9203 97.3544 42.7013 96.5734L65.8604 73.4143C66.6414 72.6333 66.6414 71.3669 65.8604 70.5859L42.7013 47.4268C41.9203 46.6458 41.9203 45.3794 42.7013 44.5984L44.5979 42.7018C45.3789 41.9208 46.6453 41.9208 47.4263 42.7018L70.5854 65.8609C71.3664 66.6419 72.6328 66.6419 73.4138 65.8609L96.5729 42.7018C97.3539 41.9208 98.6203 41.9208 99.4013 42.7018L101.298 44.5984C102.079 45.3794 102.079 46.6458 101.298 47.4268L78.1388 70.5859C77.3578 71.3669 77.3578 72.6333 78.1388 73.4143L101.298 96.5734C102.079 97.3544 102.079 98.6208 101.298 99.4018L99.4013 101.298C98.6203 102.079 97.3539 102.079 96.5729 101.298L73.4138 78.1393C72.6328 77.3583 71.3664 77.3583 70.5854 78.1393L47.4263 101.298Z"
            fill={theme.icons.error}
        />
    </svg>
);

export const ErrorIcon = withTheme(ErrorIconDef);