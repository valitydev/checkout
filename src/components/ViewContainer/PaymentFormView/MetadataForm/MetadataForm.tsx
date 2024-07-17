import { Button, LightMode, Spacer, VStack } from '@chakra-ui/react';
import { useContext } from 'react';
import { FieldError, SubmitHandler, useForm } from 'react-hook-form';

import { BackwardBox } from 'checkout/components';
import { LocaleContext, PaymentContext, PaymentModelContext, ViewModelContext } from 'checkout/contexts';
import { toDefaultFormValuesMetadata } from 'checkout/paymentCondition';
import { TerminalValues } from 'checkout/paymentMgmt';
import { isNil } from 'checkout/utils';
import { findMetadata } from 'checkout/utils/findMetadata';

import { Addon } from './Addon';
import { MetadataLogoBox } from './MetadataLogoBox';
import { formatMetadataValue } from './utils';
import { Email, MetadataField, Phone, sortByIndex } from '../../../legacy';

export type MetadataFormProps = {
    provider: string;
};

export function MetadataForm({ provider }: MetadataFormProps) {
    const { l, localeCode } = useContext(LocaleContext);
    const {
        viewAmount,
        viewModel: { hasBackward },
        backward,
    } = useContext(ViewModelContext);
    const { startPayment } = useContext(PaymentContext);
    const {
        paymentModel: { initContext, serviceProviders },
    } = useContext(PaymentModelContext);
    const { form, contactInfo, logo, prefilledMetadataValues, addon } = findMetadata(serviceProviders, provider);

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
        <form onSubmit={handleSubmit(onSubmit)}>
            <VStack align="stretch" spacing={5}>
                {hasBackward ? <BackwardBox onClick={backward} /> : <Spacer />}
                {!isNil(logo) && <MetadataLogoBox logo={logo} />}
                {!isNil(form) &&
                    form
                        ?.sort(sortByIndex)
                        .map((m) => (
                            <MetadataField
                                key={m.name}
                                fieldError={errors?.metadata?.[m.name] as FieldError}
                                isDirty={dirtyFields?.metadata?.[m.name]}
                                localeCode={localeCode}
                                metadata={m}
                                register={register}
                                wrappedName="metadata"
                            />
                        ))}
                {contactInfo?.email && (
                    <Email
                        fieldError={errors?.contactInfo?.email}
                        isDirty={dirtyFields?.contactInfo?.email}
                        locale={l}
                        register={register}
                        registerName="contactInfo.email"
                    />
                )}
                {contactInfo?.phoneNumber && (
                    <Phone
                        fieldError={errors?.contactInfo?.phoneNumber}
                        isDirty={dirtyFields?.contactInfo?.email}
                        locale={l}
                        register={register}
                        registerName="contactInfo.phoneNumber"
                    />
                )}
                {!isNil(addon) && <Addon addon={addon} />}
                <Spacer />
                <LightMode>
                    <Button borderRadius="lg" colorScheme="brand" size="lg" type="submit" variant="solid">
                        {l['form.button.pay.label']} {viewAmount}
                    </Button>
                </LightMode>
            </VStack>
        </form>
    );
}
