import * as React from 'react';
import { useContext } from 'react';

import { CardFormInfo, FormName } from 'checkout/hooks';
import { Method } from './method';
import { PaymentMethodIcon, PaymentMethodTitle } from 'checkout/components/ui';

import { InitialContext } from '../../../../../initial-context';
import { ModalContext } from '../../../../modal-context';

export const BankCard = () => {
    const { locale } = useContext(InitialContext);
    const { goToFormInfo } = useContext(ModalContext);

    const onClick = () => {
        goToFormInfo(new CardFormInfo(FormName.paymentMethods));
    };

    return (
        <Method onClick={onClick} id="bank-card-payment-method">
            <PaymentMethodIcon name="bank-card" />
            <PaymentMethodTitle>{locale['form.payment.method.name.card.label']}</PaymentMethodTitle>
        </Method>
    );
};
