import * as React from 'react';
import { useEffect } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';
import get from 'lodash-es/get';
import isNil from 'lodash-es/isNil';
import styled from 'checkout/styled-components';

import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { pay, setViewInfoError } from 'checkout/actions';
import {
    FormName,
    PaymentMethodName,
    PaymentStatus,
    PaymentTerminalFormValues,
    PaymentTerminalFormInfo
} from 'checkout/state';
import { Header } from '../header';
import { PayButton } from '../pay-button';
import { FormGroup } from '../form-group';
import {
    getActiveModalFormSelector,
    getAvailableTerminalPaymentMethodSelector,
    getInitConfigSelector,
    getModelSelector
} from 'checkout/selectors';
import { getMetadata, MetadataField, MetadataLogo } from 'checkout/components/ui';
import { toAmountConfig, toEmailConfig, toPhoneNumberConfig } from '../fields-config';
import { Amount, Email, Phone } from '../common-fields';
import { LogoContainer } from './logo-container';
import { ServiceProviderContactInfo, ServiceProviderMetadataField } from 'checkout/backend';

const Container = styled.div`
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const isInstantPayment = (form: ServiceProviderMetadataField[], contactInfo: ServiceProviderContactInfo) =>
    isNil(form) && isNil(contactInfo);

const PaymentTerminalFormRef: React.FC<InjectedFormProps> = ({ submitFailed, initialize, handleSubmit }) => {
    const initConfig = useAppSelector(getInitConfigSelector);
    const model = useAppSelector(getModelSelector);
    const { category } = useAppSelector<PaymentTerminalFormInfo>(getActiveModalFormSelector);
    const paymentMethod = useAppSelector(getAvailableTerminalPaymentMethodSelector(category));
    const serviceProvider = paymentMethod?.serviceProviders[0];
    const formValues = useAppSelector((s) => get(s.form, 'paymentTerminalForm.values'));
    const { form, contactInfo, logo } = getMetadata(serviceProvider);
    const { paymentStatus } = useAppSelector<PaymentTerminalFormInfo>(getActiveModalFormSelector);
    const amount = toAmountConfig(initConfig, model.invoiceTemplate);
    const email = toEmailConfig(initConfig.email);
    const phoneNumber = toPhoneNumberConfig(initConfig.phoneNumber);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setViewInfoError(false));
        if (!isInstantPayment(form, contactInfo)) {
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
        } else {
            submit({ provider: serviceProvider.id });
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
            <Container>
                <div>
                    <Header title={serviceProvider?.brandName} />
                    {logo && (
                        <LogoContainer>
                            <MetadataLogo metadata={logo} />
                        </LogoContainer>
                    )}
                    {form &&
                        form?.map((m) => (
                            <FormGroup key={m.name}>
                                <MetadataField metadata={m} wrappedName="metadata" localeCode={initConfig.locale} />
                            </FormGroup>
                        ))}
                    {amount.visible && (
                        <FormGroup>
                            <Amount cost={amount.cost} />
                        </FormGroup>
                    )}
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
                </div>
                {!isInstantPayment(form, contactInfo) && <PayButton />}
            </Container>
        </form>
    );
};

export const PaymentTerminalForm = reduxForm({
    form: FormName.paymentTerminalForm,
    destroyOnUnmount: false
})(PaymentTerminalFormRef);
