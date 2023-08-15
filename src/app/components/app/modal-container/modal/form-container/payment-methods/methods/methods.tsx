import * as React from 'react';

import {
    DigitalWalletPaymentMethod,
    PaymentMethod,
    PaymentMethodName,
    PaymentTerminalPaymentMethod,
} from 'checkout/hooks';
import { assertUnreachable } from 'checkout/utils';

import { BankCard } from './bank-card';
import { PaymentTerminalMethodItems } from './payment-terminal-method-items';
import { Wallets } from './wallets';
import { WalletProviderPaymentMethodItem } from '../../wallet-provider-payment-method-item';

const Method = ({ method }: { method: PaymentMethod }) => {
    switch (method.name) {
        case PaymentMethodName.BankCard:
            return <BankCard />;
        case PaymentMethodName.PaymentTerminal:
            return <PaymentTerminalMethodItems method={method as PaymentTerminalPaymentMethod} />;
        case PaymentMethodName.DigitalWallet:
            const { serviceProviders } = method as DigitalWalletPaymentMethod;
            if (serviceProviders.length === 1) {
                return <WalletProviderPaymentMethodItem serviceProvider={serviceProviders[0]} />;
            }
            return <Wallets />;
        default:
            assertUnreachable(method.name);
            return null;
    }
};

export const Methods = ({ methods }: { methods: PaymentMethod[] }) => (
    <>
        {methods.map((method, index) => (
            <Method key={index} method={method} />
        ))}
    </>
);
