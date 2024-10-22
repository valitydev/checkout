import { Spacer, VStack, Text, Flex, Button, LightMode, useToast } from '@chakra-ui/react';
import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { BackwardBox } from 'checkout/components';
import {
    CustomizationContext,
    LocaleContext,
    PaymentContext,
    PaymentModelContext,
    ViewModelContext,
} from 'checkout/contexts';
import { extractError, isNil } from 'checkout/utils';

import { CardHolderFormControl } from './CardHolderFormControl';
import { CardNumberFormControl } from './CardNumberFormControl';
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

    const onSubmit: SubmitHandler<CardFormInputs> = (values) => {
        startPayment({
            methodName: 'BankCard',
            values: {
                ...values,
                contactInfo: initContext.contactInfo,
            },
        });
    };

    const isSecureCode = isSecureCodeAvailable(watch('cardNumber'));

    const deepLink = initContext?.deepLink;

    const toast = useToast();

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
                <Spacer />
                <LightMode>
                    <Button borderRadius="xl" colorScheme="brand" size="lg" type="submit" variant="solid">
                        {l['form.button.pay.label']} {viewAmount}
                    </Button>
                </LightMode>
                {!isNil(deepLink) && (
                    <Button
                        onClick={() => {
                            // window.open(deepLink, '_self');
                            try {
                                window.location.replace(deepLink);
                            } catch (ex) {
                                toast({
                                    description: extractError(ex),
                                    status: 'error',
                                    duration: 20000,
                                    isClosable: true,
                                });
                            }
                        }}
                    >
                        Go to deep link
                    </Button>
                )}
            </VStack>
        </form>
    );
}
