import * as React from 'react';
import { useEffect } from 'react';

import { FormName, KnownProviderCategories, PaymentTerminalFormValues } from 'checkout/state';
import { Header } from '../header';
import { getAvailableTerminalPaymentMethodSelector } from 'checkout/selectors';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { ProviderSelectorField } from './provider-selector';
import { InjectedFormProps, reduxForm } from 'redux-form';
import { pay, setViewInfoError } from 'checkout/actions';
import { PayButton } from '../pay-button';
import { PaymentMethodName } from 'checkout/backend';
import styled from 'checkout/styled-components';

const ProviderSelectorDescription = styled.p`
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    margin: 0 0 8px 0;
`;

export const PaymentTerminalBankCardFormDef: React.FC<InjectedFormProps> = (props) => {
    const locale = useAppSelector((s) => s.config.locale);
    const paymentMethod = useAppSelector(getAvailableTerminalPaymentMethodSelector(KnownProviderCategories.BankCard));
    const serviceProviders = paymentMethod?.serviceProviders;
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setViewInfoError(false));
    }, []);

    useEffect(() => {
        if (props.submitFailed) {
            dispatch(setViewInfoError(true));
        }
    }, [props.submitFailed]);

    const submit = ({ provider }: PaymentTerminalFormValues) => {
        dispatch(
            pay({
                method: PaymentMethodName.PaymentTerminal,
                values: {
                    provider
                } as PaymentTerminalFormValues
            })
        );
    };

    return (
        <form onSubmit={props.handleSubmit(submit)}>
            <Header title={locale['form.header.pay.card.label']} />
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
