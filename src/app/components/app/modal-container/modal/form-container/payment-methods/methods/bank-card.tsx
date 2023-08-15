import * as React from 'react';
import { useContext } from 'react';

import { PaymentMethodIcon, PaymentMethodTitle } from 'checkout/components/ui';
import { CardFormInfo, FormName } from 'checkout/hooks';

import { Method } from './method';
import { InitialContext } from '../../../../../initial-context';
import { ModalContext } from '../../../../modal-context';

export const BankCard = () => {
    const { locale } = useContext(InitialContext);
    const { goToFormInfo } = useContext(ModalContext);

    const onClick = () => {
        goToFormInfo(new CardFormInfo(FormName.paymentMethods));
    };

    return (
        <Method id="bank-card-payment-method" onClick={onClick}>
            <PaymentMethodIcon name="bank-card" />
            <PaymentMethodTitle>{locale['form.payment.method.name.card.label']}</PaymentMethodTitle>
        </Method>
    );
};
