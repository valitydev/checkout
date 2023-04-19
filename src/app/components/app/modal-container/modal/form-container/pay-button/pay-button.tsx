import * as React from 'react';
import { useContext } from 'react';

import { AmountInfoState } from 'checkout/state';
import { formatAmount } from 'checkout/utils';
import { Button } from 'checkout/components';
import styled from 'checkout/styled-components';
import { Locale } from 'checkout/locale';

import { InitialContext } from '../../../../initial-context';

const PayButtonWrapper = styled(Button)`
    margin-top: 20px;
`;

const toLabel = (locale: Locale, amountInfo: AmountInfoState): string => {
    const amount = formatAmount(amountInfo);
    const amountLabel = amount ? ` ${amount}` : '';
    return `${locale['form.button.pay.label']}${amountLabel}`;
};

export const PayButton = () => {
    const initContext = useContext(InitialContext);
    const label = toLabel(initContext.locale, initContext.amountInfo);
    return (
        <PayButtonWrapper type="submit" color="primary" id="pay-btn">
            {label}
        </PayButtonWrapper>
    );
};
