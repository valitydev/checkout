import * as React from 'react';
import { useContext, useEffect } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';

import { FormName, PaymentTerminalFormValues } from 'checkout/state';
import { Header } from '../header';
import { useAppDispatch } from 'checkout/configure-store';
import { ProviderSelectorField } from './provider-selector';
import { pay, setViewInfoError } from 'checkout/actions';
import { PayButton } from '../pay-button';
import { PaymentMethodName } from 'checkout/backend';
import styled from 'checkout/styled-components';
import { toEmailConfig, toPhoneNumberConfig } from '../fields-config';
import { FormGroup } from '../form-group';
import { Email, Phone } from '../common-fields';
import { getMetadata } from 'checkout/components';
import isNil from 'checkout/utils/is-nil';

import { InitialContext } from '../../../../initial-context';
import { getAvailableTerminalPaymentMethod } from '../get-available-terminal-payment-method';
import { KnownProviderCategories, usePaymentPayload } from 'checkout/hooks';

const ProviderSelectorDescription = styled.p`
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    margin: 0 0 8px 0;
`;

export const PaymentTerminalBankCardFormDef: React.FC<InjectedFormProps> = ({ submitFailed, handleSubmit }) => {
    const { locale, initConfig, availablePaymentMethods } = useContext(InitialContext);
    const { paymentPayload, setFormData } = usePaymentPayload();
    const paymentMethod = getAvailableTerminalPaymentMethod(availablePaymentMethods, KnownProviderCategories.BankCard);
    const serviceProviders = paymentMethod?.serviceProviders;
    const email = toEmailConfig(initConfig.email);
    const phoneNumber = toPhoneNumberConfig(initConfig.phoneNumber);
    const { contactInfo, paymentSessionInfo } = getMetadata(serviceProviders && serviceProviders[0]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setViewInfoError(false));
    }, []);

    useEffect(() => {
        if (submitFailed) {
            dispatch(setViewInfoError(true));
        }
        if (!isNil(paymentPayload)) {
            dispatch(pay(paymentPayload));
        }
    }, [submitFailed, paymentPayload]);

    const submit = (values: PaymentTerminalFormValues) => {
        setFormData({
            method: PaymentMethodName.PaymentTerminal,
            values: {
                ...values,
                paymentSessionInfo
            } as PaymentTerminalFormValues
        });
    };

    return (
        <form onSubmit={handleSubmit(submit)}>
            <Header title={locale['form.header.pay.card.label']} />
            {email.visible && contactInfo?.email && (
                <FormGroup>
                    <Email locale={locale} />
                </FormGroup>
            )}
            {phoneNumber.visible && contactInfo?.phoneNumber && (
                <FormGroup>
                    <Phone locale={locale} />
                </FormGroup>
            )}
            <ProviderSelectorDescription>
                {locale['form.pay.paymentTerminalBankCard.providerSelectorDescription']}
            </ProviderSelectorDescription>
            {serviceProviders && <ProviderSelectorField providers={serviceProviders} />}
            <PayButton />
        </form>
    );
};

export const PaymentTerminalBankCardForm = reduxForm({
    form: FormName.paymentTerminalBankCard,
    destroyOnUnmount: true
})(PaymentTerminalBankCardFormDef);
