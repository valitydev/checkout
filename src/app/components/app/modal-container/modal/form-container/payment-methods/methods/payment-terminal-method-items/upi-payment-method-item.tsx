import * as React from 'react';
import isNil from 'lodash-es/isNil';

import { FormName, PaymentTerminalPaymentMethod } from 'checkout/state';
import { getMetadata, MetadataLogo, PaymentMethodItemContainer } from 'checkout/components/ui';
import { UPIFormInfo } from 'checkout/state/modal/form-info/upi-form-info';
import { PayAction, SetFormInfoAction } from './types';
import { payWithPaymentTerminal } from './pay-with-payment-terminal';
import { ServiceProviderMetadataField } from 'checkout/backend';

export interface UPIPaymentMethodItemProps {
    method: PaymentTerminalPaymentMethod;
    setFormInfo: SetFormInfoAction;
    pay: PayAction;
}

const toUPI = (setFormInfo: SetFormInfoAction) => setFormInfo(new UPIFormInfo(FormName.paymentMethods));

const provideMethod = (
    form: ServiceProviderMetadataField[],
    serviceProviderID: string,
    pay: PayAction,
    setFormInfo: SetFormInfoAction
) => (isNil(form) ? payWithPaymentTerminal(serviceProviderID, pay) : toUPI(setFormInfo));

export const UPIPaymentMethodItem: React.FC<UPIPaymentMethodItemProps> = ({ method, pay, setFormInfo }) => {
    const serviceProvider = method.serviceProviders[0];
    const { logo, form } = getMetadata(serviceProvider);
    return (
        <PaymentMethodItemContainer
            id="upi-payment-method-item"
            onClick={() => provideMethod(form, serviceProvider.id, pay, setFormInfo)}>
            {logo && <MetadataLogo metadata={logo} />}
        </PaymentMethodItemContainer>
    );
};
