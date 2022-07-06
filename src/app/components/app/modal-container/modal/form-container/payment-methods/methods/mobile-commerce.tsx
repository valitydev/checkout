import * as React from 'react';

import { FormName, MobileCommerceFormInfo } from 'checkout/state';
import { MethodProps } from './method-props';
import { Method } from './method';
import { Text } from './text';
import { PaymentMethodIcon, PaymentMethodTitle } from 'checkout/components/ui';

const toMobileCommerce = (props: MethodProps) => props.setFormInfo(new MobileCommerceFormInfo(FormName.paymentMethods));

export const MobileCommerce: React.FC<MethodProps> = (props) => (
    <Method onClick={toMobileCommerce.bind(null, props)} id="mobile-commerce-payment-method">
        <PaymentMethodIcon name="mobile-commerce" />
        <Text>
            <PaymentMethodTitle>{props.locale['form.payment.method.name.mobile.commerce.label']}</PaymentMethodTitle>
        </Text>
    </Method>
);
