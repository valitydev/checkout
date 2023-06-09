import * as React from 'react';
import { useContext, useEffect } from 'react';
import isNil from 'checkout/utils/is-nil';

import {
    FormName,
    PaymentTerminalFormInfo,
    PaymentTerminalSelectorFormInfo,
    ResultFormInfo,
    ResultType
} from 'checkout/hooks';
import { getMetadata, PaymentMethodItemContainer } from 'checkout/components/ui';
import { PaymentMethodName, ServiceProvider, ServiceProviderContactInfo } from 'checkout/backend';
import { Content } from './content';
import { PaymentTerminalPaymentMethod, useCreatePayment } from 'checkout/hooks';
import { PaymentTerminalFormValues } from 'checkout/state';

import { InitialContext } from '../../../../../../initial-context';
import { ModalContext } from '../../../../../modal-context';

export interface PaymentTerminalMethodItemProps {
    method: PaymentTerminalPaymentMethod;
}

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

export const PaymentTerminalMethodItem = ({ method }: PaymentTerminalMethodItemProps) => {
    const { initConfig } = useContext(InitialContext);
    const { goToFormInfo, prepareToPay } = useContext(ModalContext);

    const emailPrefilled = !!initConfig.email;
    const phoneNumberPrefilled = !!initConfig.phoneNumber;

    const { createPaymentState, setFormData } = useCreatePayment();

    const onClick = () => {
        if (method.serviceProviders.length === 1) {
            const serviceProvider = method.serviceProviders[0];
            if (isRequiredPaymentTerminalForm(serviceProvider, emailPrefilled, phoneNumberPrefilled)) {
                goToFormInfo(new PaymentTerminalFormInfo(serviceProvider.id, FormName.paymentMethods));
            } else {
                prepareToPay();
                setFormData({
                    method: PaymentMethodName.PaymentTerminal,
                    values: {
                        provider: serviceProvider.id
                    } as PaymentTerminalFormValues
                });
            }
        }
        if (method.serviceProviders.length > 1) {
            goToFormInfo(new PaymentTerminalSelectorFormInfo(method.category, FormName.paymentMethods));
        }
    };

    useEffect(() => {
        if (createPaymentState.status === 'FAILURE') {
            const error = createPaymentState.error;
            goToFormInfo(new ResultFormInfo(ResultType.hookError, { error }));
        }
    }, [createPaymentState]);

    return (
        <PaymentMethodItemContainer id={`${Math.floor(Math.random() * 100)}-payment-method-item`} onClick={onClick}>
            <Content method={method} localeCode={initConfig.locale} />
        </PaymentMethodItemContainer>
    );
};
