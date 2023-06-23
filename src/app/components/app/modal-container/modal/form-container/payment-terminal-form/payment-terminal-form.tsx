import * as React from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';
import get from 'lodash-es/get';
import styled from 'checkout/styled-components';

import { useAppSelector } from 'checkout/configure-store';
import { PaymentTerminalFormValues } from 'checkout/state';
import { FormName, PaymentStatus, PaymentTerminalFormInfo, ResultFormInfo, ResultType } from 'checkout/hooks';
import { Header } from '../header';
import { PayButton } from '../pay-button';
import { FormGroup } from '../form-group';
import { getMetadata, MetadataField, MetadataLogo, MetadataSelect } from 'checkout/components/ui';
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
import { PaymentMethodName, useCreatePayment } from 'checkout/hooks';
import { useActiveModalForm } from '../use-active-modal-form';

import { InitialContext } from '../../../../initial-context';
import { ModalContext } from '../../../modal-context';

import { SubmitHandler, useForm } from 'react-hook-form';
import { isEmptyObject } from 'checkout/utils/is-empty-object';
import isNil from 'checkout/utils/is-nil';

const Container = styled.div`
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const PaymentTerminalFormRef: React.FC<InjectedFormProps> = ({ submitFailed, initialize, handleSubmit }) => {
    const {
        locale,
        initConfig,
        model: { serviceProviders, invoiceTemplate }
    } = useContext(InitialContext);
    const { modalState, setViewInfoError, goToFormInfo, prepareToPay } = useContext(ModalContext);
    const { createPaymentState, setFormData } = useCreatePayment();
    const { providerID, paymentStatus } = useActiveModalForm<PaymentTerminalFormInfo>(modalState);
    const serviceProvider = serviceProviders.find((value) => value.id === providerID);
    const { form, contactInfo, logo, paymentSessionInfo, prefilledMetadataValues } = getMetadata(serviceProvider);
    const amount = toAmountConfig(initConfig, invoiceTemplate);
    const email = toEmailConfig(initConfig.email);
    const terminalFormValues = initConfig?.terminalFormValues;
    const phoneNumber = toPhoneNumberConfig(initConfig.phoneNumber);
    const formValues = useAppSelector((s) => get(s.form, 'paymentTerminalForm.values'));

    useEffect(() => {
        setViewInfoError(false);
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
            setViewInfoError(true);
        }
        if (createPaymentState.status === 'FAILURE') {
            const error = createPaymentState.error;
            goToFormInfo(new ResultFormInfo(ResultType.hookError, { error }));
        }
    }, [submitFailed, createPaymentState]);

    const submit = (values?: Partial<PaymentTerminalFormValues>) => {
        const payload = {
            method: PaymentMethodName.PaymentTerminal,
            values: {
                ...values,
                provider: serviceProvider?.id,
                paymentSessionInfo,
                metadata: {
                    ...prefilledMetadataValues,
                    ...formatMetadataValue(form, values?.metadata)
                }
            } as PaymentTerminalFormValues
        };
        prepareToPay();
        setFormData(payload);
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
                                {m?.addon === 'vpa' && <VpaInstruction locale={locale} />}
                            </FormGroup>
                        ))}
                    {amount.visible && (
                        <FormGroup>
                            <Amount cost={amount.cost} locale={locale} localeCode={initConfig.locale} />
                        </FormGroup>
                    )}
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
                </div>
                {!isInstantPayment(form, contactInfo, email.visible, phoneNumber.visible) && <PayButton />}
            </Container>
        </form>
    );
};

export const _PaymentTerminalForm = reduxForm({
    form: FormName.paymentTerminalForm,
    destroyOnUnmount: false
})(PaymentTerminalFormRef);

export const PaymentTerminalForm = () => {
    const {
        locale,
        initConfig,
        model: { serviceProviders }
    } = useContext(InitialContext);
    const { modalState, setViewInfoError, goToFormInfo, prepareToPay } = useContext(ModalContext);
    const { createPaymentState, setFormData } = useCreatePayment();
    const { providerID } = useActiveModalForm<PaymentTerminalFormInfo>(modalState);
    const serviceProvider = serviceProviders.find((value) => value.id === providerID);
    const { form, contactInfo, logo, paymentSessionInfo, prefilledMetadataValues } = getMetadata(serviceProvider);
    const email = toEmailConfig(initConfig.email);
    const phoneNumber = toPhoneNumberConfig(initConfig.phoneNumber);

    const defaultValues = useMemo(() => {
        const terminalFormValues = initConfig?.terminalFormValues;
        if (isNil(terminalFormValues) || isNil(form)) return null;
        return prepareFormValues(form, terminalFormValues);
    }, [initConfig, form]);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, dirtyFields, isSubmitted, isValid }
    } = useForm<PaymentTerminalFormValues>({
        mode: 'onChange',
        defaultValues
    });
    const [formTouched, setFormTouched] = useState(false);

    useEffect(() => {
        if (!formTouched && isValid) {
            onSubmit(getValues());
        }
    }, [isValid, formTouched]);

    useEffect(() => {
        if (isSubmitted && !isEmptyObject(errors)) {
            setViewInfoError(true);
        }
    }, [isSubmitted, errors]);

    useEffect(() => {
        if (createPaymentState.status === 'FAILURE') {
            goToFormInfo(
                new ResultFormInfo(ResultType.hookError, {
                    error: createPaymentState.error
                })
            );
        }
    }, [createPaymentState]);

    const onSubmit: SubmitHandler<PaymentTerminalFormValues> = (values) => {
        const payload = {
            method: PaymentMethodName.PaymentTerminal,
            values: {
                ...values,
                provider: serviceProvider?.id,
                paymentSessionInfo,
                metadata: {
                    ...prefilledMetadataValues,
                    ...formatMetadataValue(form, values?.metadata)
                }
            }
        };
        prepareToPay();
        setFormData(payload);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} onClick={() => setFormTouched(true)}>
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
                                        register={register}
                                        fieldError={errors?.metadata?.[m.name]}
                                        isDirty={dirtyFields?.metadata?.[m.name]}
                                    />
                                )}
                                {m.type !== 'select' && (
                                    <MetadataField
                                        metadata={m}
                                        localeCode={initConfig.locale}
                                        wrappedName="metadata"
                                        register={register}
                                        fieldError={errors?.metadata?.[m.name]}
                                        isDirty={dirtyFields?.metadata?.[m.name]}
                                    />
                                )}
                                {m?.addon === 'vpa' && <VpaInstruction locale={locale} />}
                            </FormGroup>
                        ))}
                    {email.visible && contactInfo?.email && (
                        <FormGroup>
                            <Email
                                locale={locale}
                                register={register}
                                fieldError={errors.email}
                                isDirty={dirtyFields.email}
                            />
                        </FormGroup>
                    )}
                    {phoneNumber.visible && contactInfo?.phoneNumber && (
                        <FormGroup>
                            <Phone
                                locale={locale}
                                register={register}
                                fieldError={errors.phoneNumber}
                                isDirty={dirtyFields.email}
                            />
                        </FormGroup>
                    )}
                </div>
                <PayButton />
            </Container>
        </form>
    );
};
