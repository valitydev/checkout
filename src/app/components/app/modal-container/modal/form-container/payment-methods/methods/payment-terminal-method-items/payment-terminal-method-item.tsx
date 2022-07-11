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
import { ServiceProvider, ServiceProviderContactInfo } from 'checkout/backend';

export interface PaymentTerminalMethodItemProps {
    method: PaymentTerminalPaymentMethod;
    setFormInfo: SetFormInfoAction;
    pay: PayAction;
    localeCode: string;
    emailPrefilled: boolean;
    phoneNumberPrefilled: boolean;
}

const toPaymentTerminal = (category: KnownProviderCategories, setFormInfo: SetFormInfoAction) =>
    setFormInfo(new PaymentTerminalFormInfo(category, FormName.paymentMethods));

const isRequiredEmail = (contactInfo: ServiceProviderContactInfo, emailPrefilled: boolean): boolean =>
    !isNil(contactInfo) && contactInfo.email === true && !emailPrefilled;

const isRequiredPhoneNumber = (contactInfo: ServiceProviderContactInfo, phoneNumberPrefilled: boolean): boolean =>
    !isNil(contactInfo) && contactInfo.phoneNumber === true && !phoneNumberPrefilled;

const isRequiredPaymentTerminalForm = (
    serviceProvider: ServiceProvider,
    emailPrefilled: boolean,
    phoneNumberPrefilled: boolean
): boolean => {
    const { form, contactInfo } = getMetadata(serviceProvider);
    return (
        !isNil(form) ||
        isRequiredEmail(contactInfo, emailPrefilled) ||
        isRequiredPhoneNumber(contactInfo, phoneNumberPrefilled)
    );
};

const provideMethod = (
    serviceProvider: ServiceProvider,
    pay: PayAction,
    setFormInfo: SetFormInfoAction,
    emailPrefilled: boolean,
    phoneNumberPrefilled: boolean
) => {
    return isRequiredPaymentTerminalForm(serviceProvider, emailPrefilled, phoneNumberPrefilled)
        ? toPaymentTerminal(serviceProvider.category as KnownProviderCategories, setFormInfo)
        : payWithPaymentTerminal(serviceProvider.id, pay);
};

export const PaymentTerminalMethodItem: React.FC<PaymentTerminalMethodItemProps> = ({
    method,
    pay,
    setFormInfo,
    localeCode,
    emailPrefilled,
    phoneNumberPrefilled
}) => {
    const serviceProvider = method.serviceProviders[0];
    const { logo, title } = getMetadata(serviceProvider);
    return (
        <PaymentMethodItemContainer
            id={`${serviceProvider.id}-payment-method-item`}
            onClick={() => provideMethod(serviceProvider, pay, setFormInfo, emailPrefilled, phoneNumberPrefilled)}>
            {title && <MetadataTitle metadata={title} localeCode={localeCode} />}
            {logo && <MetadataLogo metadata={logo} />}
        </PaymentMethodItemContainer>
    );
};
