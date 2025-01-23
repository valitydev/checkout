import { Spacer, VStack, Text, Flex, Button, LightMode } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { BackwardBox } from 'checkout/components';
import {
    CustomizationContext,
    LocaleContext,
    PaymentContext,
    PaymentModelContext,
    ViewModelContext,
} from 'checkout/contexts';
import { isBoolean, isNil, isString } from 'checkout/utils';

import { CardHolderFormControl } from './CardHolderFormControl';
import { CardNumberFormControl } from './CardNumberFormControl';
import { DateOfBirthFormControl } from './DateOfBirthFormControl';
import { ExpDateFormControl } from './ExpDateFormControl';
import { SecureCodeFormControl } from './SecureCodeFormControl';
import { CardFormInputs } from './types';
import { isSecureCodeAvailable } from './utils';

export function CardForm() {
    const { l } = useContext(LocaleContext);
    const {
        viewAmount,
        viewModel: { hasBackward },
        backward,
    } = useContext(ViewModelContext);
    const { startPayment } = useContext(PaymentContext);
    const { obscureCardCvv, requireCardHolder } = useContext(CustomizationContext);
    const {
        paymentModel: { initContext },
    } = useContext(PaymentModelContext);
    const { register, handleSubmit, watch, formState } = useForm<CardFormInputs>({ mode: 'onChange' });

    const { dateOfBirth, documentId } = initContext.contactInfo;

    const showDateOfBirth = isBoolean(dateOfBirth);
    const showDocumentId = isBoolean(documentId);

    useEffect(() => {
        console.log('Contact info', initContext.contactInfo);
    }, [initContext.contactInfo]);

    const onSubmit: SubmitHandler<CardFormInputs> = (values) => {
        const contactInfo = {
            ...initContext.contactInfo,
            dateOfBirth: isString(dateOfBirth) ? dateOfBirth : values.dateOfBirth,
            documentId: isString(documentId) ? documentId : values.documentId,
        };
        const payload = {
            ...values,
            contactInfo,
        };
        console.log('payload', payload);
        // startPayment({
        //     methodName: 'BankCard',
        //     values: {
        //         ...values,
        //         contactInfo,
        //     },
        // });
    };

    const isSecureCode = isSecureCodeAvailable(watch('cardNumber'));

    const deepLink = initContext?.deepLink;

    useEffect(() => {
        if (isNil(deepLink)) return;
        window.location.replace(deepLink);
    }, [deepLink]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <VStack align="stretch" spacing={5}>
                <Flex alignItems="center">
                    {hasBackward && <BackwardBox onClick={backward} />}
                    <Text fontWeight="medium" textAlign="center" width="full">
                        {l['form.header.pay.card.label']}
                    </Text>
                </Flex>
                <CardNumberFormControl formState={formState} register={register} />
                <Flex gap={5}>
                    <ExpDateFormControl formState={formState} register={register} />
                    {isSecureCode && (
                        <SecureCodeFormControl
                            formState={formState}
                            obscureCardCvv={obscureCardCvv}
                            register={register}
                            watch={watch}
                        />
                    )}
                </Flex>
                {requireCardHolder && <CardHolderFormControl formState={formState} register={register} />}
                {showDateOfBirth && <DateOfBirthFormControl formState={formState} register={register} />}
                <Spacer />
                <LightMode>
                    <Button borderRadius="xl" colorScheme="brand" size="lg" type="submit" variant="solid">
                        {l['form.button.pay.label']} {viewAmount}
                    </Button>
                </LightMode>
                {!isNil(deepLink) && (
                    <Button
                        onClick={() => {
                            window.open(deepLink, '_self');
                            // window.location.replace(deepLink);
                        }}
                    >
                        Go to deep link
                    </Button>
                )}
            </VStack>
        </form>
    );
}
