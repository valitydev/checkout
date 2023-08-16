import * as React from 'react';

import { ErrorIcon } from './error-icon';
import { SuccessIcon } from './success-icon';
import { WarningIcon } from './warning-icon';
import { ResultFormType } from '../make-content';

interface ResultIconProps {
    type: ResultFormType;
}

export const ResultIcon: React.FC<ResultIconProps> = ({ type }) => {
    switch (type) {
        case ResultFormType.ERROR:
            return <ErrorIcon />;
        case ResultFormType.WARNING:
            return <WarningIcon />;
        case ResultFormType.SUCCESS:
            return <SuccessIcon />;
    }
};
