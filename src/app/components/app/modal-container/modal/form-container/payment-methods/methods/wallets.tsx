import * as React from 'react';
import { useContext } from 'react';

import { FormName, WalletProvidersFormInfo } from 'checkout/state';
import { Method } from './method';
import { Text } from './text';
import { PaymentMethodIcon, PaymentMethodTitle } from 'checkout/components/ui';
import { useAppDispatch } from 'checkout/configure-store';
import { goToFormInfo } from 'checkout/actions';

import { InitialContext } from '../../../../../initial-context';

export const Wallets = () => {
    const { locale } = useContext(InitialContext);
    const dispatch = useAppDispatch();

    const onClick = () => {
        dispatch(goToFormInfo(new WalletProvidersFormInfo(FormName.paymentMethods)));
    };

    return (
        <Method onClick={onClick} id="wallets-payment-method">
            <PaymentMethodIcon name="wallets" />
            <Text>
                <PaymentMethodTitle>{locale['form.payment.method.name.wallet.label']}</PaymentMethodTitle>
            </Text>
        </Method>
    );
};
