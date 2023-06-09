import * as React from 'react';
import { useContext, useEffect } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';

import { FormName, ResultFormInfo, ResultType } from 'checkout/hooks';
import { Header } from '../header';
import { ProviderSelectorField } from './provider-selector';
import { PayButton } from '../pay-button';
import { PaymentMethodName } from 'checkout/backend';
import styled from 'checkout/styled-components';
import { toEmailConfig, toPhoneNumberConfig } from '../fields-config';
import { FormGroup } from '../form-group';
import { Email, Phone } from '../common-fields';
import { getMetadata } from 'checkout/components';

import { InitialContext } from '../../../../initial-context';
import { getAvailableTerminalPaymentMethod } from '../get-available-terminal-payment-method';
import { KnownProviderCategories, useCreatePayment } from 'checkout/hooks';
import { ModalContext } from '../../../modal-context';
import { PaymentTerminalFormValues } from 'checkout/state';

const ProviderSelectorDescription = styled.p`
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    margin: 0 0 8px 0;
`;

export const PaymentTerminalBankCardFormDef: React.FC<InjectedFormProps> = ({ submitFailed, handleSubmit }) => {
    const { locale, initConfig, availablePaymentMethods } = useContext(InitialContext);
    const { goToFormInfo, prepareToPay, setViewInfoError } = useContext(ModalContext);
    const { createPaymentState, setFormData } = useCreatePayment();
    const paymentMethod = getAvailableTerminalPaymentMethod(availablePaymentMethods, KnownProviderCategories.BankCard);
    const serviceProviders = paymentMethod?.serviceProviders;
    const email = toEmailConfig(initConfig.email);
    const phoneNumber = toPhoneNumberConfig(initConfig.phoneNumber);
    const { contactInfo, paymentSessionInfo } = getMetadata(serviceProviders && serviceProviders[0]);

    useEffect(() => {
        setViewInfoError(false);
    }, []);

    useEffect(() => {
        if (submitFailed) {
            setViewInfoError(true);
        }
        if (createPaymentState.status === 'FAILURE') {
            const error = createPaymentState.error;
            goToFormInfo(new ResultFormInfo(ResultType.hookError, { error }));
        }
    }, [submitFailed, createPaymentState]);

    const submit = (values: PaymentTerminalFormValues) => {
        prepareToPay();
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
