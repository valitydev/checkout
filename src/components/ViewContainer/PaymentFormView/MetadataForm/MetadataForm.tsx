import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { LogoContainer } from './LogoContainer';
import { MetadataFormInputs } from './types';
import { useDefaultFormValues } from './useDefaultFormValues';
import { formatMetadataValue } from './utils';
import {
    CustomizationContext,
    LocaleContext,
    PaymentContext,
    PaymentModelContext,
    ViewModelContext,
} from '../../../../common/contexts';
import { findMetadata, isNil } from '../../../../common/utils';
import {
    Email,
    FormGroup,
    MetadataField,
    MetadataLogo,
    MetadataSelect,
    PayButton,
    Phone,
    sortByIndex,
} from '../../../legacy';

export type MetadataFormProps = {
    provider: string;
};

export function MetadataForm({ provider }: MetadataFormProps) {
    const { l } = useContext(LocaleContext);
    const { viewAmount } = useContext(ViewModelContext);
    const { startPayment } = useContext(PaymentContext);
    const { localeCode } = useContext(CustomizationContext);
    const {
        paymentModel: { initContext, serviceProviders },
    } = useContext(PaymentModelContext);
    const { form, contactInfo, logo, prefilledMetadataValues } = findMetadata(serviceProviders, provider);
    const {
        register,
        handleSubmit,
        formState: { errors, dirtyFields },
    } = useForm({
        mode: 'onChange',
        defaultValues: useDefaultFormValues(initContext, form),
    });

    const onSubmit: SubmitHandler<MetadataFormInputs> = (values) => {
        startPayment({
            methodName: 'PaymentTerminal',
            values: {
                provider,
                metadata: {
                    ...prefilledMetadataValues,
                    ...formatMetadataValue(form, values?.metadata),
                },
            },
        });
    };

    return (
        <>
            {!isNil(logo) && (
                <LogoContainer>
                    <MetadataLogo metadata={logo} />
                </LogoContainer>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                {!isNil(form) &&
                    form?.sort(sortByIndex).map((m) => (
                        <FormGroup key={m.name} direction={'column'}>
                            {m.type === 'select' && (
                                <MetadataSelect
                                    fieldError={errors?.metadata?.[m.name]}
                                    isDirty={dirtyFields?.metadata?.[m.name]}
                                    localeCode={localeCode}
                                    metadata={m}
                                    register={register}
                                    wrappedName="metadata"
                                />
                            )}
                            {m.type !== 'select' && (
                                <MetadataField
                                    fieldError={errors?.metadata?.[m.name]}
                                    isDirty={dirtyFields?.metadata?.[m.name]}
                                    localeCode={localeCode}
                                    metadata={m}
                                    register={register}
                                    wrappedName="metadata"
                                />
                            )}
                        </FormGroup>
                    ))}
                {contactInfo?.email && (
                    <FormGroup>
                        <Email fieldError={errors.email} isDirty={dirtyFields.email} locale={l} register={register} />
                    </FormGroup>
                )}
                {contactInfo?.phoneNumber && (
                    <FormGroup>
                        <Phone
                            fieldError={errors.phoneNumber}
                            isDirty={dirtyFields.email}
                            locale={l}
                            register={register}
                        />
                    </FormGroup>
                )}
                <PayButton l={l} viewAmount={viewAmount} />
            </form>
        </>
    );
}
