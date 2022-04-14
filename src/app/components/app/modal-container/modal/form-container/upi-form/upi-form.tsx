import * as React from 'react';
import { useEffect } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';
import get from 'lodash-es/get';

import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { pay, setViewInfoError } from 'checkout/actions';
import {
    FormName,
    KnownProviderCategories,
    PaymentMethodName,
    PaymentStatus,
    PaymentTerminalFormValues,
    UPIFormInfo
} from 'checkout/state';
import { Header } from '../header';
import { PayButton } from '../pay-button';
import { LogoContainer } from './logo-container';
import { FormGroup } from '../form-group';
import {
    getActiveModalFormSelector,
    getAvailableTerminalPaymentMethodSelector,
    getInitConfigSelector,
    getLocaleSelector,
    getModelSelector
} from 'checkout/selectors';
import { Instruction } from './instruction';
import { getMetadata, MetadataField, MetadataLogo } from 'checkout/components/ui';
import { toFieldsConfig } from '../fields-config';
import { Amount } from '../common-fields';

const UPIFormRef: React.FC<InjectedFormProps> = ({ submitFailed, initialize, handleSubmit }) => {
    const locale = useAppSelector(getLocaleSelector);
    const initConfig = useAppSelector(getInitConfigSelector);
    const model = useAppSelector(getModelSelector);
    const paymentMethod = useAppSelector(getAvailableTerminalPaymentMethodSelector(KnownProviderCategories.UPI));
    const serviceProvider = paymentMethod?.serviceProviders[0];
    const formValues = useAppSelector((s) => get(s.form, 'upiForm.values'));
    const { form, logo } = getMetadata(serviceProvider);
    const { paymentStatus } = useAppSelector<UPIFormInfo>(getActiveModalFormSelector);
    const amount = toFieldsConfig(initConfig, model.invoiceTemplate).amount;
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setViewInfoError(false));
        switch (paymentStatus) {
            case PaymentStatus.pristine:
                initialize({
                    amount: formValues?.amount,
                    provider: serviceProvider.id
                });
                break;
            case PaymentStatus.needRetry:
                submit(formValues);
                break;
        }
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
            <Header title={locale['form.header.pay.upi.label']} />
            <LogoContainer>
                <MetadataLogo metadata={logo} />
            </LogoContainer>
            {form?.map((m) => (
                <FormGroup key={m.name}>
                    <MetadataField locale={locale} metadata={m} />
                </FormGroup>
            ))}
            {amount.visible && (
                <FormGroup>
                    <Amount cost={amount.cost} />
                </FormGroup>
            )}
            <Instruction locale={locale} />
            <PayButton />
        </form>
    );
};

export const UPIForm = reduxForm({
    form: FormName.upiForm,
    destroyOnUnmount: false
})(UPIFormRef);
