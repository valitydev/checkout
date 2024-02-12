import { useContext } from 'react';
import { FieldError, SubmitHandler, useForm } from 'react-hook-form';

import { LogoContainer } from './LogoContainer';
import { formatMetadataValue } from './utils';
import {
    CustomizationContext,
    LocaleContext,
    PaymentContext,
    PaymentModelContext,
    ViewModelContext,
} from '../../../../common/contexts';
import { toDefaultFormValuesMetadata } from '../../../../common/paymentCondition';
import { TerminalValues } from '../../../../common/paymentMgmt';
import { findMetadata, isNil } from '../../../../common/utils';
import {
    ChevronButton,
    Email,
    FormGroup,
    HeaderWrapper,
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
    const {
        viewAmount,
        viewModel: { hasBackward },
        backward,
    } = useContext(ViewModelContext);
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
        defaultValues: {
            contactInfo: initContext.contactInfo,
            metadata: toDefaultFormValuesMetadata(initContext.terminalFormValues, form),
        },
    });

    const onSubmit: SubmitHandler<TerminalValues> = ({ contactInfo, metadata }) => {
        startPayment({
            methodName: 'PaymentTerminal',
            values: {
                provider,
                contactInfo,
                metadata: {
                    ...formatMetadataValue(form, metadata),
                    ...prefilledMetadataValues,
                },
            },
        });
    };

    return (
        <>
            {hasBackward && (
                <HeaderWrapper>
                    <ChevronButton type="left" onClick={backward} />
                </HeaderWrapper>
            )}
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
                                    fieldError={errors?.metadata?.[m.name] as FieldError}
                                    isDirty={dirtyFields?.metadata?.[m.name]}
                                    localeCode={localeCode}
                                    metadata={m}
                                    register={register}
                                    wrappedName="metadata"
                                />
                            )}
                            {m.type !== 'select' && (
                                <MetadataField
                                    fieldError={errors?.metadata?.[m.name] as FieldError}
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
                        <Email
                            fieldError={errors?.contactInfo?.email}
                            isDirty={dirtyFields?.contactInfo?.email}
                            locale={l}
                            register={register}
                            registerName="contactInfo.email"
                        />
                    </FormGroup>
                )}
                {contactInfo?.phoneNumber && (
                    <FormGroup>
                        <Phone
                            fieldError={errors?.contactInfo?.phoneNumber}
                            isDirty={dirtyFields?.contactInfo?.email}
                            locale={l}
                            register={register}
                            registerName="contactInfo.phoneNumber"
                        />
                    </FormGroup>
                )}
                <PayButton l={l} viewAmount={viewAmount} />
            </form>
        </>
    );
}
