import * as React from 'react';
import { useContext, useEffect } from 'react';
import isNil from 'checkout/utils/is-nil';

import {
    FormName,
    PaymentTerminalFormInfo,
    PaymentTerminalFormValues,
    PaymentTerminalSelectorFormInfo
} from 'checkout/state';
import { getMetadata, PaymentMethodItemContainer } from 'checkout/components/ui';
import { PaymentMethodName, ServiceProvider, ServiceProviderContactInfo } from 'checkout/backend';
import { Content } from './content';
import { goToFormInfo, pay } from 'checkout/actions';
import { PaymentTerminalPaymentMethod } from 'checkout/hooks';
import { useAppDispatch } from 'checkout/configure-store';

import { InitialContext } from '../../../../../../initial-context';
import { usePreparePayableData } from '../../../use-prepare-payable-data';

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
    const emailPrefilled = !!initConfig.email;
    const phoneNumberPrefilled = !!initConfig.phoneNumber;

    const [preparedPayload, setSubmitData] = usePreparePayableData();
    const dispatch = useAppDispatch();

    const onClick = () => {
        if (method.serviceProviders.length === 1) {
            const serviceProvider = method.serviceProviders[0];
            if (isRequiredPaymentTerminalForm(serviceProvider, emailPrefilled, phoneNumberPrefilled)) {
                dispatch(goToFormInfo(new PaymentTerminalFormInfo(serviceProvider.id, FormName.paymentMethods)));
            } else {
                setSubmitData({
                    method: PaymentMethodName.PaymentTerminal,
                    values: {
                        provider: serviceProvider.id
                    } as PaymentTerminalFormValues
                });
            }
        }
        if (method.serviceProviders.length > 1) {
            dispatch(goToFormInfo(new PaymentTerminalSelectorFormInfo(method.category, FormName.paymentMethods)));
        }
    };

    useEffect(() => {
        if (!isNil(preparedPayload)) {
            dispatch(pay(preparedPayload));
        }
    }, [preparedPayload]);

    return (
        <PaymentMethodItemContainer id={`${Math.floor(Math.random() * 100)}-payment-method-item`} onClick={onClick}>
            <Content method={method} localeCode={initConfig.locale} />
        </PaymentMethodItemContainer>
    );
};
