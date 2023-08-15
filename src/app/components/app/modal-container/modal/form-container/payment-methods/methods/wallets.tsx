import { useContext } from 'react';

import { PaymentMethodIcon, PaymentMethodTitle } from 'checkout/components/ui';
import { FormName, WalletProvidersFormInfo } from 'checkout/hooks';

import { Method } from './method';
import { Text } from './text';
import { InitialContext } from '../../../../../initial-context';
import { ModalContext } from '../../../../modal-context';

export const Wallets = () => {
    const { locale } = useContext(InitialContext);
    const { goToFormInfo } = useContext(ModalContext);

    const onClick = () => {
        goToFormInfo(new WalletProvidersFormInfo(FormName.paymentMethods));
    };

    return (
        <Method id="wallets-payment-method" onClick={onClick}>
            <PaymentMethodIcon name="wallets" />
            <Text>
                <PaymentMethodTitle>{locale['form.payment.method.name.wallet.label']}</PaymentMethodTitle>
            </Text>
        </Method>
    );
};
