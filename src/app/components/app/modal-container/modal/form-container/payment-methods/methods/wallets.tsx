import * as React from 'react';

import { FormName, WalletProvidersFormInfo } from 'checkout/state';
import { MethodProps } from './method-props';
import { Method } from './method';
import { Text } from './text';
import { PaymentMethodIcon, PaymentMethodTitle } from 'checkout/components/ui';

const toWalletProviders = (props: MethodProps) =>
    props.setFormInfo(new WalletProvidersFormInfo(FormName.paymentMethods));

export const Wallets: React.FC<MethodProps> = (props) => (
    <Method onClick={toWalletProviders.bind(null, props)} id="wallets-payment-method">
        <PaymentMethodIcon name="wallets" />
        <Text>
            <PaymentMethodTitle>{props.locale['form.payment.method.name.wallet.label']}</PaymentMethodTitle>
        </Text>
    </Method>
);
