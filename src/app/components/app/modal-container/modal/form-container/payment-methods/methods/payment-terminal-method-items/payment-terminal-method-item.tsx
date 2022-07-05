import * as React from 'react';
import isNil from 'lodash-es/isNil';

import {
    FormName,
    KnownProviderCategories,
    PaymentTerminalFormInfo,
    PaymentTerminalPaymentMethod
} from 'checkout/state';
import { getMetadata, MetadataLogo, MetadataTitle, PaymentMethodItemContainer } from 'checkout/components/ui';
import { PayAction, SetFormInfoAction } from './types';
import { payWithPaymentTerminal } from './pay-with-payment-terminal';
import { ServiceProvider } from 'checkout/backend';

export interface PaymentTerminalMethodItemProps {
    method: PaymentTerminalPaymentMethod;
    setFormInfo: SetFormInfoAction;
    pay: PayAction;
    localeCode: string;
}

const toPaymentTerminal = (category: KnownProviderCategories, setFormInfo: SetFormInfoAction) =>
    setFormInfo(new PaymentTerminalFormInfo(category, FormName.paymentMethods));

const provideMethod = (serviceProvider: ServiceProvider, pay: PayAction, setFormInfo: SetFormInfoAction) => {
    const { form } = getMetadata(serviceProvider);
    return isNil(form)
        ? payWithPaymentTerminal(serviceProvider.id, pay)
        : toPaymentTerminal(serviceProvider.category as KnownProviderCategories, setFormInfo);
};

export const PaymentTerminalMethodItem: React.FC<PaymentTerminalMethodItemProps> = ({
    method,
    pay,
    setFormInfo,
    localeCode
}) => {
    const serviceProvider = method.serviceProviders[0];
    const { logo, title } = getMetadata(serviceProvider);
    return (
        <PaymentMethodItemContainer
            id={`${serviceProvider.id}-payment-method-item`}
            onClick={() => provideMethod(serviceProvider, pay, setFormInfo)}>
            {title && <MetadataTitle metadata={title} localeCode={localeCode} />}
            {logo && <MetadataLogo metadata={logo} />}
        </PaymentMethodItemContainer>
    );
};
