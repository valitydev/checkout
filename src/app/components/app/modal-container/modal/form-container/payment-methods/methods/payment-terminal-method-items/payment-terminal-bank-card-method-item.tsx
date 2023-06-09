import * as React from 'react';
import { useContext } from 'react';

import { Method } from '../method';
import { FormName, PaymentTerminalBankCardFormInfo } from 'checkout/hooks';
import { PaymentMethodIcon, PaymentMethodTitle } from 'checkout/components/ui';

import { InitialContext } from '../../../../../../initial-context';
import { ModalContext } from '../../../../../modal-context';

export const PaymentTerminalBankCardMethodItem = () => {
    const { locale } = useContext(InitialContext);
    const { goToFormInfo } = useContext(ModalContext);

    const onClick = () => {
        goToFormInfo(new PaymentTerminalBankCardFormInfo(FormName.paymentMethods));
    };

    return (
        <Method onClick={onClick} id="payment-terminal-bank-card-method-item">
            <PaymentMethodIcon name="bank-card" />
            <PaymentMethodTitle>{locale['form.payment.method.name.card.label']}</PaymentMethodTitle>
        </Method>
    );
};
