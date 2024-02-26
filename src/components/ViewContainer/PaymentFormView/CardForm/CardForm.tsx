import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { CardHolder } from './CardHolder';
import { CardNumber } from './CardNumber';
import { ExpireDate } from './ExpireDate';
import { SecureCode } from './SecureCode';
import { CardFormInputs } from './types';
import { isSecureCodeAvailable } from './utils';
import {
    CustomizationContext,
    LocaleContext,
    PaymentContext,
    PaymentModelContext,
    ViewModelContext,
} from '../../../../common/contexts';
import { ChevronButton, FormGroup, HeaderWrapper, PayButton, Title } from '../../../../components/legacy';

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
        <>
            <HeaderWrapper>
                {hasBackward && <ChevronButton type="left" onClick={backward} />}
                <Title>{l['form.header.pay.card.label']}</Title>
            </HeaderWrapper>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormGroup>
                    <CardNumber
                        fieldError={errors.cardNumber}
                        isDirty={dirtyFields.cardNumber}
                        locale={l}
                        register={register}
                        watch={watch}
                    />
                </FormGroup>
                <FormGroup $gap={10}>
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
                </FormGroup>
                {requireCardHolder && (
                    <FormGroup>
                        <CardHolder
                            fieldError={errors.cardHolder}
                            isDirty={dirtyFields.cardHolder}
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
