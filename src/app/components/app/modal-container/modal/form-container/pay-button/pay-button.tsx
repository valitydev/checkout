import * as React from 'react';
import { useContext } from 'react';

import { formatAmount } from 'checkout/utils';
import { Button } from 'checkout/components';
import styled from 'checkout/styled-components';
import { Locale } from 'checkout/locale';
import { AmountInfo } from 'checkout/hooks';

import { InitialContext } from '../../../../initial-context';

const PayButtonWrapper = styled(Button)`
    margin-top: 20px;
`;

const toLabel = (locale: Locale, amountInfo: AmountInfo): string => {
    const amount = formatAmount(amountInfo);
    const amountLabel = amount ? ` ${amount}` : '';
    return `${locale['form.button.pay.label']}${amountLabel}`;
};

export const PayButton = () => {
    const { locale, amountInfo } = useContext(InitialContext);
    const label = toLabel(locale, amountInfo);
    return (
        <PayButtonWrapper type="submit" color="primary" id="pay-btn">
            {label}
        </PayButtonWrapper>
    );
};
