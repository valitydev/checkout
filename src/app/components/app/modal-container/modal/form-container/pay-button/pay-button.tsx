import { useContext } from 'react';
import styled from 'styled-components';

import { Button } from 'checkout/components';
import { AmountInfo } from 'checkout/hooks';
import { Locale } from 'checkout/locale';
import { formatAmount } from 'checkout/utils';

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
        <PayButtonWrapper color="primary" id="pay-btn" type="submit">
            {label}
        </PayButtonWrapper>
    );
};
