import * as React from 'react';
import isNil from 'lodash-es/isNil';

import { FormName, PaymentTerminalFormInfo, PaymentTerminalPaymentMethod } from 'checkout/state';
import { getMetadata, MetadataLogo, PaymentMethodItemContainer } from 'checkout/components/ui';
import { PayAction, SetFormInfoAction } from './types';
import { payWithPaymentTerminal } from './pay-with-payment-terminal';
import { ServiceProviderMetadataField } from 'checkout/backend';

export interface PaymentTerminalMethodItemProps {
    method: PaymentTerminalPaymentMethod;
    setFormInfo: SetFormInfoAction;
    pay: PayAction;
}

const toPaymentTerminal = (setFormInfo: SetFormInfoAction) =>
    setFormInfo(new PaymentTerminalFormInfo(FormName.paymentMethods));

const provideMethod = (
    form: ServiceProviderMetadataField[],
    serviceProviderID: string,
    pay: PayAction,
    setFormInfo: SetFormInfoAction
) => (isNil(form) ? payWithPaymentTerminal(serviceProviderID, pay) : toPaymentTerminal(setFormInfo));

export const PaymentTerminalMethodItem: React.FC<PaymentTerminalMethodItemProps> = ({ method, pay, setFormInfo }) => {
    const serviceProvider = method.serviceProviders[0];
    const { logo, form } = getMetadata(serviceProvider);
    return (
        <PaymentMethodItemContainer
            id={`${serviceProvider.id}-payment-method-item`}
            onClick={() => provideMethod(form, serviceProvider.id, pay, setFormInfo)}>
            {logo && <MetadataLogo metadata={logo} />}
        </PaymentMethodItemContainer>
    );
};
