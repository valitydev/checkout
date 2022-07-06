import * as React from 'react';

import { Method } from '../method';
import { PaymentMethodIcon, PaymentMethodTitle } from 'checkout/components/ui';
import { Locale } from 'checkout/locale';
import { PayAction } from './types';
import { payWithPaymentTerminal } from './pay-with-payment-terminal';
import { PaymentTerminalPaymentMethod } from 'checkout/state';

export interface PaymentTerminalDigitalWalletsMethodItemProps {
    method: PaymentTerminalPaymentMethod;
    locale: Locale;
    pay: PayAction;
}

export const PaymentTerminalDigitalWalletsMethodItem: React.FC<PaymentTerminalDigitalWalletsMethodItemProps> = ({
    method,
    pay,
    locale
}) => (
    <Method
        onClick={() => payWithPaymentTerminal(method.serviceProviders[0].id, pay)}
        id="payment-terminal-digital-wallets-method-item">
        <PaymentMethodIcon name="wallets" />
        <PaymentMethodTitle>{locale['form.payment.method.name.wallet.label']}</PaymentMethodTitle>
    </Method>
);
