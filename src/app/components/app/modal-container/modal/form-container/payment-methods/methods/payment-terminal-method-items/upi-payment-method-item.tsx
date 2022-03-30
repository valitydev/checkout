import * as React from 'react';
import { FormInfo, FormName, KnownProviderCategories } from 'checkout/state';
import { PaymentMethodItemContainer, UPILogo } from 'checkout/components/ui';
import { UPIFormInfo } from 'checkout/state/modal/form-info/upi-form-info';

export interface UPIPaymentMethodItemProps {
    setFormInfo: (formInfo: FormInfo) => any;
    category: KnownProviderCategories;
}

const toUPI = (props: UPIPaymentMethodItemProps) =>
    props.setFormInfo(new UPIFormInfo(props.category, FormName.paymentMethods));

export const UPIPaymentMethodItem: React.FC<UPIPaymentMethodItemProps> = (props) => (
    <PaymentMethodItemContainer id="upi-payment-method-item" onClick={toUPI.bind(null, props)}>
        <UPILogo />
    </PaymentMethodItemContainer>
);
