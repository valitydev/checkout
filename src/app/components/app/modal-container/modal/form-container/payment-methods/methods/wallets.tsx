import * as React from 'react';
import { useContext } from 'react';

import { FormName, WalletProvidersFormInfo } from 'checkout/hooks';
import { Method } from './method';
import { Text } from './text';
import { PaymentMethodIcon, PaymentMethodTitle } from 'checkout/components/ui';

import { InitialContext } from '../../../../../initial-context';
import { ModalContext } from '../../../../modal-context';

export const Wallets = () => {
    const { locale } = useContext(InitialContext);
    const { goToFormInfo } = useContext(ModalContext);

    const onClick = () => {
        goToFormInfo(new WalletProvidersFormInfo(FormName.paymentMethods));
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
