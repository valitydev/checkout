import * as React from 'react';

import { Method } from '../method';
import { Title } from '../title';
import { Icon } from '../icon/icon';
import { FormName, PaymentTerminalBankCardFormInfo } from 'checkout/state';
import { Locale } from 'checkout/locale';
import { SetFormInfoAction } from './types';

export interface PaymentTerminalBankCardMethodItemProps {
    locale: Locale;
    setFormInfo: SetFormInfoAction;
}

const toPaymentTerminalBankCard = (props: PaymentTerminalBankCardMethodItemProps) =>
    props.setFormInfo(new PaymentTerminalBankCardFormInfo(FormName.paymentMethods));

export const PaymentTerminalBankCardMethodItem: React.FC<PaymentTerminalBankCardMethodItemProps> = (props) => (
    <Method onClick={toPaymentTerminalBankCard.bind(null, props)} id="payment-terminal-bank-card-method-item">
        <Icon name="bank-card" />
        <Title>{props.locale['form.payment.method.name.card.label']}</Title>
    </Method>
);
