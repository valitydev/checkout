import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { LogoContainer } from './LogoContainer';
import { MetadataFormInputs } from './types';
import { useDefaultFormValues } from './useDefaultFormValues';
import { formatMetadataValue } from './utils';
import { CustomizationContext, LocaleContext, PaymentModelContext } from '../../../../common/contexts';
import { PaymentTerminal } from '../../../../common/paymentModel';
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
import { ViewModelContext } from '../../ViewModelContext';

export type MetadataFormProps = {
    paymentMethod: PaymentTerminal;
};

export function MetadataForm({ paymentMethod: { methodName, providers } }: MetadataFormProps) {
    if (providers.length !== 1) {
        throw new Error('MetadataForm. Providers length must be 1');
    }

    const provider = providers[0];
    const { l } = useContext(LocaleContext);
    const { viewAmount, onSetPaymentPayload } = useContext(ViewModelContext);
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
        onSetPaymentPayload({
            methodName,
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
