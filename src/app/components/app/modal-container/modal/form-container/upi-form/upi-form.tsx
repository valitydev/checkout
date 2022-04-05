import * as React from 'react';
import { useEffect } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';

import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { pay, setViewInfoError } from 'checkout/actions';
import { FormName, KnownProviderCategories, PaymentMethodName, PaymentTerminalFormValues } from 'checkout/state';
import { Header } from '../header';
import { PayButton } from '../pay-button';
import { Logo } from './logo';
import { FormGroup } from '../form-group';
import { getAvailableTerminalPaymentMethodSelector } from 'checkout/selectors';
import { METADATA_NAMESPACE } from 'checkout/backend';
import { Instruction } from './instruction';
import { MetadataField } from 'checkout/components/ui';

const UPIFormRef: React.FC<InjectedFormProps> = (props) => {
    const locale = useAppSelector((s) => s.config.locale);
    const paymentMethod = useAppSelector(getAvailableTerminalPaymentMethodSelector(KnownProviderCategories.UPI));
    const serviceProvider = paymentMethod?.serviceProviders[0];
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
            <Header title={locale['form.header.pay.upi.label']} />
            <Logo />
            {formMetadata?.map((fieldMetadata) => (
                <FormGroup key={fieldMetadata.name}>
                    <MetadataField locale={locale} metadata={fieldMetadata} />
                </FormGroup>
            ))}
            <Instruction locale={locale} />
            <PayButton />
        </form>
    );
};

export const UPIForm = reduxForm({
    form: FormName.upiForm,
    destroyOnUnmount: true
})(UPIFormRef);
