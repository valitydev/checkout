import * as React from 'react';
import { useContext } from 'react';

import { Method } from '../method';
import { FormName, PaymentTerminalBankCardFormInfo } from 'checkout/state';
import { PaymentMethodIcon, PaymentMethodTitle } from 'checkout/components/ui';
import { useAppDispatch } from 'checkout/configure-store';
import { goToFormInfo } from 'checkout/actions';

import { InitialContext } from '../../../../../../initial-context';

export const PaymentTerminalBankCardMethodItem = () => {
    const { locale } = useContext(InitialContext);
    const dispatch = useAppDispatch();

    const onClick = () => {
        dispatch(goToFormInfo(new PaymentTerminalBankCardFormInfo(FormName.paymentMethods)));
    };

    return (
        <Method onClick={onClick} id="payment-terminal-bank-card-method-item">
            <PaymentMethodIcon name="bank-card" />
            <PaymentMethodTitle>{locale['form.payment.method.name.card.label']}</PaymentMethodTitle>
        </Method>
    );
};
