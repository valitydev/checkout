import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { LogoContainer } from './LogoContainer';
import { useDefaultFormValues } from './useDefaultFormValues';
import { formatMetadataValue } from './utils';
import { CustomizationContext, LocaleContext } from '../../../../common/contexts';
import { isNil } from '../../../../common/utils';
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
import { MetadataFormModel, MetadataFormInputs, MetadataFormSubmitFormValues } from '../types';

export type MetadataFormProps = {
    formModel: MetadataFormModel;
    onSubmitForm: (data: MetadataFormSubmitFormValues) => void;
};

export function MetadataForm({ formModel, onSubmitForm }: MetadataFormProps) {
    const { l } = useContext(LocaleContext);
    const { localeCode } = useContext(CustomizationContext);

    const {
        metadata: { form, contactInfo, logo, prefilledMetadataValues },
        provider,
        initContext,
        viewAmount,
    } = formModel;
    const {
        register,
        handleSubmit,
        formState: { errors, dirtyFields },
    } = useForm({
        mode: 'onChange',
        defaultValues: useDefaultFormValues(initContext, form),
    });

    const onSubmit: SubmitHandler<MetadataFormInputs> = (values) => {
        onSubmitForm({
            formName: 'MetadataForm',
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
