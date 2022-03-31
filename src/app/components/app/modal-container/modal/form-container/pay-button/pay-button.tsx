import * as React from 'react';
import { connect } from 'react-redux';

import { AmountInfoState, ConfigState, State } from 'checkout/state';
import { formatAmount } from 'checkout/utils';
import { Button } from 'checkout/components';
import styled from 'checkout/styled-components';

const PayButtonWrapper = styled(Button)`
    margin-top: 20px;
`;

export interface PayButtonProps {
    label: string;
}

const PayButtonDef: React.FC<PayButtonProps> = (props) => (
    <PayButtonWrapper type="submit" color="primary" id="pay-btn">
        {props.label}
    </PayButtonWrapper>
);

const toLabel = ({ locale }: ConfigState, amountInfo: AmountInfoState): string => {
    const amount = formatAmount(amountInfo);
    const amountLabel = amount ? ` ${amount}` : '';
    return `${locale['form.button.pay.label']}${amountLabel}`;
};

const mapStateToProps = (s: State) => ({
    label: toLabel(s.config, s.amountInfo)
});

export const PayButton = connect(mapStateToProps)(PayButtonDef);
