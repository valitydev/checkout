import * as React from 'react';
import { useEffect } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';

import { Header } from '../header';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { getActiveModalFormSelector } from 'checkout/selectors';
import { FormName, OnlineBankingAccountFormInfo, PaymentTerminalFormValues, PaymentMethodName } from 'checkout/state';
import { FormGroup } from '../form-group';
import { MetadataField } from 'checkout/components';
import { Amount } from '../common-fields';
import { toFieldsConfig } from '../fields-config';
import { PayButton } from '../pay-button';
import { pay, setViewInfoError } from 'checkout/actions';
import { METADATA_NAMESPACE } from 'checkout/backend';
import { ProviderLogo } from './provider-logo';

const OnlineBankingAccountFormRef: React.FC<InjectedFormProps> = (props) => {
    const formInfo = useAppSelector<OnlineBankingAccountFormInfo>(getActiveModalFormSelector);
    const { amount } = useAppSelector((s) => toFieldsConfig(s.config.initConfig, s.model.invoiceTemplate));
    const { serviceProvider } = formInfo;
    const metadata = serviceProvider?.metadata;
    const formMetadata = metadata && metadata[METADATA_NAMESPACE]?.form;
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setViewInfoError(false));
    }, []);

    useEffect(() => {
        if (props.submitFailed) {
            dispatch(setViewInfoError(true));
        }
    }, [props.submitFailed]);

    const submit = (values: PaymentTerminalFormValues) => {
        (document.activeElement as HTMLElement)?.blur();
        dispatch(
            pay({
                method: PaymentMethodName.PaymentTerminal,
                values: { ...values, provider: serviceProvider.id } as PaymentTerminalFormValues
            })
        );
    };

    return (
        <form onSubmit={props.handleSubmit(submit)}>
            <Header title={serviceProvider?.brandName} />
            <ProviderLogo />
            {formMetadata?.map((fieldMetadata) => (
                <FormGroup key={fieldMetadata.name}>
                    <MetadataField metadata={fieldMetadata} wrappedName="metadata" />
                </FormGroup>
            ))}
            {amount.visible && (
                <FormGroup>
                    <Amount cost={amount.cost} />
                </FormGroup>
            )}
            <PayButton />
        </form>
    );
};

export const OnlineBankingAccountForm = reduxForm({
    form: FormName.onlineBankingAccountForm,
    destroyOnUnmount: true
})(OnlineBankingAccountFormRef);
