import * as React from 'react';
import { useEffect } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';

import { FormName, KnownProviderCategories, PaymentTerminalFormValues } from 'checkout/state';
import { Header } from '../header';
import { getAvailableTerminalPaymentMethodSelector, getInitConfigSelector } from 'checkout/selectors';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { ProviderSelectorField } from './provider-selector';
import { pay, setViewInfoError } from 'checkout/actions';
import { PayButton } from '../pay-button';
import { PaymentMethodName } from 'checkout/backend';
import styled from 'checkout/styled-components';
import { toEmailConfig, toPhoneNumberConfig } from '../fields-config';
import { FormGroup } from '../form-group';
import { Email, Phone } from '../common-fields';
import { getMetadata } from 'checkout/components';

const ProviderSelectorDescription = styled.p`
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    margin: 0 0 8px 0;
`;

export const PaymentTerminalBankCardFormDef: React.FC<InjectedFormProps> = ({ submitFailed, handleSubmit }) => {
    const initConfig = useAppSelector(getInitConfigSelector);
    const locale = useAppSelector((s) => s.config.locale);
    const paymentMethod = useAppSelector(getAvailableTerminalPaymentMethodSelector(KnownProviderCategories.BankCard));
    const serviceProviders = paymentMethod?.serviceProviders;
    const email = toEmailConfig(initConfig.email);
    const phoneNumber = toPhoneNumberConfig(initConfig.phoneNumber);
    const { contactInfo } = getMetadata(serviceProviders && serviceProviders[0]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setViewInfoError(false));
    }, []);

    useEffect(() => {
        if (submitFailed) {
            dispatch(setViewInfoError(true));
        }
    }, [submitFailed]);

    const submit = (values: PaymentTerminalFormValues) => {
        dispatch(
            pay({
                method: PaymentMethodName.PaymentTerminal,
                values
            })
        );
    };

    return (
        <form onSubmit={handleSubmit(submit)}>
            <Header title={locale['form.header.pay.card.label']} />
            {email.visible && contactInfo?.email && (
                <FormGroup>
                    <Email />
                </FormGroup>
            )}
            {phoneNumber.visible && contactInfo?.phoneNumber && (
                <FormGroup>
                    <Phone />
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
