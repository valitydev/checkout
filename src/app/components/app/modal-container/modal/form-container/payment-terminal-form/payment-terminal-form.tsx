import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { getMetadata, MetadataField, MetadataLogo, MetadataSelect } from 'checkout/components/ui';
import { PaymentTerminalFormInfo, ResultFormInfo, ResultType, PaymentTerminalFormValues } from 'checkout/hooks';
import { PaymentMethodName, useCreatePayment } from 'checkout/hooks';
import { isEmptyObject } from 'checkout/utils/is-empty-object';

import { Container } from './container';
import { formatMetadataValue } from './format-metadata-value';
import { LogoContainer } from './logo-container';
import { sortByIndex } from './sort-by-index';
import { useDefaultFormValues } from './use-default-form-values';
import { VpaInstruction } from './vpa-instruction';
import { InitialContext } from '../../../../initial-context';
import { ModalContext } from '../../../modal-context';
import { Email, Phone } from '../common-fields';
import { FormGroup } from '../form-group';
import { Header } from '../header';
import { PayButton } from '../pay-button';
import { useActiveModalForm } from '../use-active-modal-form';

const PaymentTerminalForm = ({ onMount }: { onMount: () => void }) => {
    const {
        locale,
        initConfig,
        model: { serviceProviders },
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
        formState: { errors, dirtyFields, isSubmitted, isValid },
    } = useForm<PaymentTerminalFormValues>({
        mode: 'onChange',
        defaultValues,
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
                    error: createPaymentState.error,
                }),
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
                    ...formatMetadataValue(form, values?.metadata),
                },
            },
        };
        prepareToPay();
        setFormData(payload);
    };

    return (
        <form onClick={() => setFormTouched(true)} onSubmit={handleSubmit(onSubmit)}>
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
                                        fieldError={errors?.metadata?.[m.name]}
                                        isDirty={dirtyFields?.metadata?.[m.name]}
                                        localeCode={initConfig.locale}
                                        metadata={m}
                                        register={register}
                                        wrappedName="metadata"
                                    />
                                )}
                                {m.type !== 'select' && (
                                    <MetadataField
                                        fieldError={errors?.metadata?.[m.name]}
                                        isDirty={dirtyFields?.metadata?.[m.name]}
                                        localeCode={initConfig.locale}
                                        metadata={m}
                                        register={register}
                                        wrappedName="metadata"
                                    />
                                )}
                                {m?.addon === 'vpa' && <VpaInstruction locale={locale} />}
                            </FormGroup>
                        ))}
                    {contactInfo?.email && (
                        <FormGroup>
                            <Email
                                fieldError={errors.email}
                                isDirty={dirtyFields.email}
                                locale={locale}
                                register={register}
                            />
                        </FormGroup>
                    )}
                    {contactInfo?.phoneNumber && (
                        <FormGroup>
                            <Phone
                                fieldError={errors.phoneNumber}
                                isDirty={dirtyFields.email}
                                locale={locale}
                                register={register}
                            />
                        </FormGroup>
                    )}
                </div>
                <PayButton />
            </Container>
        </form>
    );
};

export default PaymentTerminalForm;
