import * as React from 'react';
import { useContext } from 'react';

import { CardFormInfo, FormName } from 'checkout/state';
import { Method } from './method';
import { PaymentMethodIcon, PaymentMethodTitle } from 'checkout/components/ui';
import { useAppDispatch } from 'checkout/configure-store';
import { goToFormInfo } from 'checkout/actions';

import { InitialContext } from '../../../../../initial-context';

export const BankCard = () => {
    const {
        initConfig: { locale }
    } = useContext(InitialContext);
    const dispatch = useAppDispatch();

    const onClick = () => {
        dispatch(goToFormInfo(new CardFormInfo(FormName.paymentMethods)));
    };

    return (
        <Method onClick={onClick} id="bank-card-payment-method">
            <PaymentMethodIcon name="bank-card" />
            <PaymentMethodTitle>{locale['form.payment.method.name.card.label']}</PaymentMethodTitle>
        </Method>
    );
};
