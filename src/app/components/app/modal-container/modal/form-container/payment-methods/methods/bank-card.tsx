import * as React from 'react';
import { CardFormInfo, FormName } from 'checkout/state';
import { MethodProps } from './method-props';
import { Method } from './method';
import { PaymentMethodIcon, PaymentMethodTitle } from 'checkout/components/ui';

const toBankCard = (props: MethodProps) => props.setFormInfo(new CardFormInfo(FormName.paymentMethods));

export const BankCard: React.FC<MethodProps> = (props) => (
    <Method onClick={toBankCard.bind(null, props)} id="bank-card-payment-method">
        <PaymentMethodIcon name="bank-card" />
        <PaymentMethodTitle>{props.locale['form.payment.method.name.card.label']}</PaymentMethodTitle>
    </Method>
);
