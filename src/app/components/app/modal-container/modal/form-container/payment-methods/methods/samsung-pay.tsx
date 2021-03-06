import * as React from 'react';

import { MethodProps } from './method-props';
import { FormName, PaymentMethodName, TokenProviderFormInfo } from 'checkout/state';
import { BankCardTokenProvider } from 'checkout/backend/model';
import { Method } from './method';
import { PaymentMethodIcon, PaymentMethodTitle } from 'checkout/components/ui';

const toTokenProvider = (props: MethodProps) =>
    props.setFormInfo(new TokenProviderFormInfo(BankCardTokenProvider.samsungpay, FormName.paymentMethods));

const TokenProviderFormLink: React.FC<MethodProps> = (props) => (
    <Method onClick={toTokenProvider.bind(null, props)} id="samsung-pay-payment-method">
        <PaymentMethodIcon name="samsung-pay" />
        <PaymentMethodTitle>{props.locale['form.payment.method.name.samsung.pay.label']}</PaymentMethodTitle>
    </Method>
);

const pay = (props: MethodProps) => props.pay({ method: PaymentMethodName.SamsungPay });

const SamsungPayLink: React.FC<MethodProps> = (props) => (
    <Method onClick={pay.bind(null, props)} id="samsung-pay-payment-method">
        <svg width="100%" height="40" viewBox="-75 -13 600 80">
            <path
                d="M385.3 1.2V5c-3.9-3.2-8.8-5-13.9-5-12.6 0-22.9 11-22.9 24.5S358.7 49 371.4 49c5.1 0 10-1.8 13.9-5v4.2h10.5v-47h-10.5zm-12.7 38.6c-7.6 0-13.8-6.8-13.8-15.3S365 9.3 372.6 9.3s13.8 6.8 13.8 15.3-6.2 15.2-13.8 15.2zM319.7 0c-5.1 0-10.1 1.8-14 5.2v-4h-10.6v64.1h10.5V43.9c3.9 3.3 8.9 5.1 14 5.2 12.6 0 22.9-11 22.9-24.5S332.4 0 319.7 0zm-1.2 39.8c-7.6 0-13.8-6.8-13.8-15.3s6.2-15.3 13.8-15.3 13.8 6.8 13.8 15.3-6.2 15.3-13.8 15.3zm122-38.6l-13.5 32-14.4-32h-10.4l19.8 44-8.5 20.1h10.3l27-64.1h-10.3zM228.3 7.7l.5 31h-.2l-9.1-31h-14.7v39.1h9.7l-.5-32.1h.2l9.8 32.1h14.1V7.7h-9.8zm-186 0L35 47.2h10.7l5.4-35.9h.2l5.3 35.9h10.6L59.9 7.7H42.3zm59.7 0l-4.9 30.2h-.2L92.1 7.7H75.9L75 47.2h9.9l.2-35.5h.2L92 47.2h10l6.6-35.5h.2l.2 35.5h9.9L118 7.7h-16zM18.4 36c.3 1 .3 2 .1 3-.3 1.3-1.2 2.6-3.9 2.6-2.5 0-4-1.4-4-3.6v-3.9H0v3c0 8.8 6.9 11.5 14.4 11.5 7.2 0 13-2.4 14-9 .4-2.2.4-4.3 0-6.5-1.7-8.3-16.7-10.7-17.8-15.4-.1-.7-.1-1.4 0-2.1.3-1.3 1.1-2.7 3.6-2.7 1.9-.2 3.5 1.2 3.7 3v3h9.9v-2.8c0-8.6-7.7-10-13.3-10-7 0-12.8 2.3-13.8 8.8-.4 1.8-.4 3.6 0 5.4C2.3 28.6 16.3 30.9 18.4 36m128.4 0c.3.9.3 1.9.1 2.9-.3 1.3-1.2 2.6-3.8 2.6-2.4 0-3.9-1.4-3.9-3.5v-3.8h-10.5v3c0 8.7 6.9 11.3 14.2 11.3 7.1 0 12.9-2.4 13.8-8.9.4-2.1.4-4.3 0-6.4-1.7-8.1-16.6-10.6-17.6-15.2-.1-.7-.1-1.3 0-2 .3-1.3 1.1-2.6 3.6-2.6 1.8-.2 3.5 1.2 3.6 3v2.9h9.7v-2.8c0-8.5-7.6-9.9-13.2-9.9-7 0-12.6 2.3-13.7 8.7-.3 1.7-.3 3.5.1 5.3 1.7 8 15.6 10.3 17.6 15.4m33.2 5.2c1.8.2 3.4-1.1 3.8-2.8.1-.5.1-1 .1-1.5V7.7h10V36c0 .7-.1 2.2-.1 2.6-.7 7.4-6.5 9.8-13.8 9.8s-13.1-2.4-13.8-9.8c0-.4-.1-1.9-.1-2.6V7.7h10v29.2c0 .5 0 1 .1 1.5.4 1.8 2 3 3.8 2.8m82.4-.4c2.9 0 3.9-1.8 4-2.8.1-.5.1-1 .1-1.5v-5.7h-4V25h14v10.6c0 .7 0 1.3-.1 2.6-.6 7.2-6.9 9.8-13.9 9.8s-13.2-2.6-13.9-9.8c-.1-1.3-.1-1.9-.1-2.6V18.9c0-.9.1-1.7.2-2.6.9-7.4 6.9-9.8 13.9-9.8s13.1 2.3 13.9 9.8c.1.9.1 1.7.1 2.6v1.3h-10V18c0-.5 0-1-.1-1.5-.2-.9-.9-2.9-4-2.9-1.9-.2-3.5 1.1-3.9 2.9-.1.6-.2 1.2-.2 1.9v18.1c0 .5 0 1 .1 1.5 0 1 1 2.8 3.9 2.8"
                fill="#034ea2"
            />
        </svg>
    </Method>
);

export const SamsungPay: React.FC<MethodProps> = (props) => {
    return props.amountPrefilled && props.emailPrefilled ? (
        <SamsungPayLink {...props} />
    ) : (
        <TokenProviderFormLink {...props} />
    );
};
