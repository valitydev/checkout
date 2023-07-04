import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { PaymentTerminalFormInfo, ResultFormInfo, ResultType, PaymentTerminalFormValues } from 'checkout/hooks';
import { Header } from '../header';
import { PayButton } from '../pay-button';
import { FormGroup } from '../form-group';
import { getMetadata, MetadataField, MetadataLogo, MetadataSelect } from 'checkout/components/ui';
import { Email, Phone } from '../common-fields';
import { LogoContainer } from './logo-container';
import { formatMetadataValue } from './format-metadata-value';
import { sortByIndex } from './sort-by-index';
import { VpaInstruction } from './vpa-instruction';
import { PaymentMethodName, useCreatePayment } from 'checkout/hooks';
import { useActiveModalForm } from '../use-active-modal-form';
import { isEmptyObject } from 'checkout/utils/is-empty-object';
import { useDefaultFormValues } from './use-default-form-values';
import { Container } from './container';

import { InitialContext } from '../../../../initial-context';
import { ModalContext } from '../../../modal-context';

export const PaymentTerminalForm = ({ onMount }: { onMount: () => void }) => {
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
    const defaultValues = useDefaultFormValues(initConfig, form);
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
        onMount();
    }, []);

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
                    {contactInfo?.email && (
                        <FormGroup>
                            <Email
                                locale={locale}
                                register={register}
                                fieldError={errors.email}
                                isDirty={dirtyFields.email}
                            />
                        </FormGroup>
                    )}
                    {contactInfo?.phoneNumber && (
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
