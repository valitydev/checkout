import { Spacer, VStack, Text, Flex, HStack, Button, LightMode } from '@chakra-ui/react';
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

import { CardHolder } from './CardHolder';
import { CardNumber } from './CardNumber';
import { ExpireDate } from './ExpireDate';
import { SecureCode } from './SecureCode';
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
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, dirtyFields },
    } = useForm<CardFormInputs>({ mode: 'onChange' });

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

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <VStack align="stretch" spacing={5}>
                <Flex alignItems="center">
                    {hasBackward && <BackwardBox onClick={backward} />}
                    <Text fontWeight="medium" textAlign="center" width="full">
                        {l['form.header.pay.card.label']}
                    </Text>
                </Flex>
                <CardNumber
                    fieldError={errors.cardNumber}
                    isDirty={dirtyFields.cardNumber}
                    locale={l}
                    register={register}
                    watch={watch}
                />
                <HStack align="stretch" spacing={5}>
                    <ExpireDate
                        fieldError={errors.expireDate}
                        isDirty={dirtyFields.expireDate}
                        locale={l}
                        register={register}
                    />
                    {isSecureCode && (
                        <SecureCode
                            cardNumber={watch('cardNumber')}
                            fieldError={errors.secureCode}
                            isDirty={dirtyFields.secureCode}
                            locale={l}
                            obscureCardCvv={obscureCardCvv}
                            register={register}
                        />
                    )}
                </HStack>
                {requireCardHolder && (
                    <CardHolder
                        fieldError={errors.cardHolder}
                        isDirty={dirtyFields.cardHolder}
                        locale={l}
                        register={register}
                    />
                )}
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
