import * as React from 'react';

import { KnownProviderCategories, PaymentTerminalPaymentMethod } from 'checkout/hooks';
import { assertUnreachable } from 'checkout/utils';
import { PaymentTerminalBankCardMethodItem } from './payment-terminal-bank-card-method-item';
import { PaymentTerminalMethodItem } from './payment-terminal-method-item';

export interface PaymentTerminalMethodItemsProps {
    method: PaymentTerminalPaymentMethod;
}

export const PaymentTerminalMethodItems = ({ method }: PaymentTerminalMethodItemsProps) => {
    switch (method.category) {
        case KnownProviderCategories.UPI:
        case KnownProviderCategories.PIX:
        case KnownProviderCategories.PaymentTerminal:
        case KnownProviderCategories.DigitalWallet:
        case KnownProviderCategories.NetBanking:
        case KnownProviderCategories.OnlineBanking:
            return <PaymentTerminalMethodItem method={method} />;
        case KnownProviderCategories.BankCard:
            return <PaymentTerminalBankCardMethodItem />;
        default:
            assertUnreachable(method.category);
            return null;
    }
};
