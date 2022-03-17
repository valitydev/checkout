import * as React from 'react';
import { FormInfo, FormName } from 'checkout/state';
import { PaymentMethodItemContainer, UPILogo } from 'checkout/components/ui';
import { UPIFormInfo } from 'checkout/state/modal/form-info/upi-form-info';
import { ServiceProvider } from 'checkout/backend';

export interface UPIPaymentMethodItemProps {
    setFormInfo: (formInfo: FormInfo) => any;
    previous: FormName;
    serviceProvider: ServiceProvider;
}

const toUPI = (props: UPIPaymentMethodItemProps) =>
    props.setFormInfo(new UPIFormInfo(props.serviceProvider, props.previous));

export const UPIPaymentMethodItem: React.FC<UPIPaymentMethodItemProps> = (props) => (
    <PaymentMethodItemContainer id="upi-payment-method-item" onClick={toUPI.bind(null, props)}>
        <UPILogo />
    </PaymentMethodItemContainer>
);
