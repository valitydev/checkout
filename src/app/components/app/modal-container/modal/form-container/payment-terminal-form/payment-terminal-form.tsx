import * as React from 'react';
import { useEffect } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';
import get from 'lodash-es/get';
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
    getInitConfigSelector,
    getLocaleSelector,
    getModelSelector,
    getServiceProviderSelector
} from 'checkout/selectors';
import { getMetadata, MetadataField, MetadataLogo } from 'checkout/components/ui';
import { toAmountConfig, toEmailConfig, toPhoneNumberConfig } from '../fields-config';
import { Amount, Email, Phone } from '../common-fields';
import { LogoContainer } from './logo-container';
import { formatMetadataValue } from './format-metadata-value';
import { sortByIndex } from './sort-by-index';
import { isInstantPayment } from './is-instant-payment';
import { VpaInstruction } from './vpa-instruction';
import {
    isInitConfigFormValues,
    isReadyToProvidePaymentFromInitConfig,
    prepareFormValues
} from './init-config-payment';
import { MetadataSelect } from './metadata-select';

const Container = styled.div`
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const PaymentTerminalFormRef: React.FC<InjectedFormProps> = ({ submitFailed, initialize, handleSubmit }) => {
    const locale = useAppSelector(getLocaleSelector);
    const { providerID, paymentStatus } = useAppSelector<PaymentTerminalFormInfo>(getActiveModalFormSelector);
    const serviceProvider = useAppSelector(getServiceProviderSelector(providerID));
    const { form, contactInfo, logo, paymentSessionInfo } = getMetadata(serviceProvider);
    const initConfig = useAppSelector(getInitConfigSelector);
    const model = useAppSelector(getModelSelector);
    const amount = toAmountConfig(initConfig, model.invoiceTemplate);
    const email = toEmailConfig(initConfig.email);
    const terminalFormValues = initConfig?.terminalFormValues;
    const phoneNumber = toPhoneNumberConfig(initConfig.phoneNumber);
    const formValues = useAppSelector((s) => get(s.form, 'paymentTerminalForm.values'));
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setViewInfoError(false));
        if (isInitConfigFormValues(form, terminalFormValues)) {
            switch (paymentStatus) {
                case PaymentStatus.pristine:
                    const prepared = prepareFormValues(form, terminalFormValues);
                    initialize(prepared);
                    if (isReadyToProvidePaymentFromInitConfig(formValues, prepared, form)) {
                        submit(prepared);
                    }
                    break;
                case PaymentStatus.needRetry:
                    submit(formValues);
                    break;
            }
        } else if (!isInstantPayment(form, contactInfo, email.visible, phoneNumber.visible)) {
            switch (paymentStatus) {
                case PaymentStatus.pristine:
                    initialize({
                        amount: formValues?.amount
                    });
                    break;
                case PaymentStatus.needRetry:
                    submit(formValues);
                    break;
            }
        } else {
            submit();
        }
    }, []);

    useEffect(() => {
        if (submitFailed) {
            dispatch(setViewInfoError(true));
        }
    }, [submitFailed]);

    const submit = (values?: Partial<PaymentTerminalFormValues>) => {
        dispatch(
            pay({
                method: PaymentMethodName.PaymentTerminal,
                values: {
                    ...values,
                    provider: serviceProvider.id,
                    paymentSessionInfo,
                    metadata: formatMetadataValue(form, values?.metadata)
                } as PaymentTerminalFormValues
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
                        form?.sort(sortByIndex).map((m) => (
                            <FormGroup key={m.name} direction={'column'}>
                                {m.type === 'select' && (
                                    <MetadataSelect
                                        metadata={m}
                                        wrappedName="metadata"
                                        localeCode={initConfig.locale}
                                    />
                                )}
                                {m.type !== 'select' && (
                                    <MetadataField metadata={m} wrappedName="metadata" localeCode={initConfig.locale} />
                                )}
                                {m.name === 'VPA' && <VpaInstruction locale={locale} />}
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
                {!isInstantPayment(form, contactInfo, email.visible, phoneNumber.visible) && <PayButton />}
            </Container>
        </form>
    );
};

export const PaymentTerminalForm = reduxForm({
    form: FormName.paymentTerminalForm,
    destroyOnUnmount: false
})(PaymentTerminalFormRef);
