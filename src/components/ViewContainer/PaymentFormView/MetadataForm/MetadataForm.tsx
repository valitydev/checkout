import { Button, LightMode, Spacer, VStack } from '@chakra-ui/react';
import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { BackwardBox, PaneLogoBox, PaneMetadataLogo } from 'checkout/components';
import { LocaleContext, PaymentContext, PaymentModelContext, ViewModelContext } from 'checkout/contexts';
import { toDefaultFormValuesMetadata } from 'checkout/paymentCondition';
import { TerminalValues } from 'checkout/paymentMgmt';
import { isNil } from 'checkout/utils';
import { findMetadata } from 'checkout/utils/findMetadata';

import { Addon } from './Addon';
import { EmailFormControl, PhoneNumberFormControl } from './ContactInfoFormControls';
import { MetadataFormControl } from './MetadataFormControl';
import { MetadataFormValues } from './types';
import { formatMetadataValue, sortByIndex } from './utils';

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
    const {
        paymentModel: { initContext, serviceProviders },
    } = useContext(PaymentModelContext);
    const { form, contactInfo, logo, prefilledMetadataValues, addon } = findMetadata(serviceProviders, provider);

    const { register, handleSubmit, formState } = useForm<MetadataFormValues>({
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
                {!isNil(logo) && (
                    <PaneLogoBox alignSelf="center" width="50%">
                        <PaneMetadataLogo logo={logo} />
                    </PaneLogoBox>
                )}
                {!isNil(form) &&
                    form
                        ?.sort(sortByIndex)
                        .map((m) => (
                            <MetadataFormControl key={m.name} formState={formState} metadata={m} register={register} />
                        ))}
                {contactInfo?.email && <EmailFormControl formState={formState} register={register} />}
                {contactInfo?.phoneNumber && <PhoneNumberFormControl formState={formState} register={register} />}
                {!isNil(addon) && <Addon addon={addon} />}
                <Spacer />
                <LightMode>
                    <Button borderRadius="xl" colorScheme="brand" size="lg" type="submit" variant="solid">
                        {l['form.button.pay.label']} {viewAmount}
                    </Button>
                </LightMode>
            </VStack>
        </form>
    );
}
