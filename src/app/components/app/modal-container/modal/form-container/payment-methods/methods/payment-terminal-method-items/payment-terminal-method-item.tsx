import * as React from 'react';
import isNil from 'lodash-es/isNil';

import { FormName, PaymentTerminalFormInfo, PaymentTerminalSelectorFormInfo } from 'checkout/state';
import { getMetadata, PaymentMethodItemContainer } from 'checkout/components/ui';
import { PayAction, SetFormInfoAction } from './types';
import { payWithPaymentTerminal } from './pay-with-payment-terminal';
import { ServiceProvider, ServiceProviderContactInfo } from 'checkout/backend';
import { Content } from './content';
import { AppContext } from 'checkout/actions';
import { KnownProviderCategories, PaymentTerminalPaymentMethod } from 'checkout/hooks';

export interface PaymentTerminalMethodItemProps {
    method: PaymentTerminalPaymentMethod;
    setFormInfo: SetFormInfoAction;
    pay: PayAction;
    localeCode: string;
    emailPrefilled: boolean;
    phoneNumberPrefilled: boolean;
    context: AppContext;
}

const toPaymentTerminalSelector = (category: KnownProviderCategories, setFormInfo: SetFormInfoAction) =>
    setFormInfo(new PaymentTerminalSelectorFormInfo(category, FormName.paymentMethods));

const toPaymentTerminal = (serviceProviderID: string, setFormInfo: SetFormInfoAction) =>
    setFormInfo(new PaymentTerminalFormInfo(serviceProviderID, FormName.paymentMethods));

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
    method: PaymentTerminalPaymentMethod,
    pay: PayAction,
    setFormInfo: SetFormInfoAction,
    emailPrefilled: boolean,
    phoneNumberPrefilled: boolean,
    context: AppContext
) => {
    if (method.serviceProviders.length === 1) {
        const serviceProvider = method.serviceProviders[0];
        return isRequiredPaymentTerminalForm(serviceProvider, emailPrefilled, phoneNumberPrefilled)
            ? toPaymentTerminal(serviceProvider.id, setFormInfo)
            : payWithPaymentTerminal(context, serviceProvider.id, pay);
    }
    if (method.serviceProviders.length > 1) {
        return toPaymentTerminalSelector(method.category, setFormInfo);
    }
};

export const PaymentTerminalMethodItem = ({
    method,
    pay,
    setFormInfo,
    localeCode,
    emailPrefilled,
    phoneNumberPrefilled,
    context
}: PaymentTerminalMethodItemProps) => (
    <PaymentMethodItemContainer
        id={`${Math.floor(Math.random() * 100)}-payment-method-item`}
        onClick={() => provideMethod(method, pay, setFormInfo, emailPrefilled, phoneNumberPrefilled, context)}>
        <Content method={method} localeCode={localeCode} />
    </PaymentMethodItemContainer>
);
