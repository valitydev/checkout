import * as React from 'react';

import { MethodProps } from './method-props';
import { TokenProviderFormInfo, FormName, PaymentMethodName } from 'checkout/state';
import { BankCardTokenProvider } from 'checkout/backend/model';
import { Method } from './method';
import styled from 'checkout/styled-components';
import { PaymentMethodIcon, PaymentMethodTitle } from 'checkout/components/ui';

const toTokenProvider = (props: MethodProps) =>
    props.setFormInfo(new TokenProviderFormInfo(BankCardTokenProvider.applepay, FormName.paymentMethods));

const TokenProviderFormLink: React.FC<MethodProps> = (props) => (
    <Method onClick={toTokenProvider.bind(null, props)} id="apple-pay-payment-method">
        <PaymentMethodIcon name="apple-pay" />
        <PaymentMethodTitle>{props.locale['form.payment.method.name.apple.pay.label']}</PaymentMethodTitle>
    </Method>
);

const pay = (props: MethodProps) => props.pay({ method: PaymentMethodName.ApplePay });

export const ApplePayButton = styled((props) => (
    <button type="button" className={props.className} onClick={pay.bind(null, props)} />
))`
    cursor: pointer;
    width: 100%;
    padding: 38px;
    margin-bottom: 10px;
    transition: all 0.3s;
    -webkit-appearance: -apple-pay-button;
    -apple-pay-button-style: white-outline;
`;

export const ApplePay: React.FC<MethodProps> = (props) => {
    return props.amountPrefilled && props.emailPrefilled ? (
        <ApplePayButton {...props} />
    ) : (
        <TokenProviderFormLink {...props} />
    );
};
