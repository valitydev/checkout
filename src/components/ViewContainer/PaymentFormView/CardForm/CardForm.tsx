import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { CardHolder } from './CardHolder';
import { CardNumber } from './CardNumber';
import { ExpireDate } from './ExpireDate';
import { SecureCode } from './SecureCode';
import { CardFormInputs } from './types';
import { isSecureCodeAvailable } from './utils';
import { CustomizationContext, LocaleContext } from '../../../../common/contexts';
import { BankCard } from '../../../../common/paymentModel';
import { FormGroup, HeaderWrapper, PayButton, Title } from '../../../../components/legacy';
import { ViewModelContext } from '../../ViewModelContext';

export type MetadataFormProps = {
    paymentMethod: BankCard;
};

export function CardForm({ paymentMethod: { methodName } }: MetadataFormProps) {
    const { l } = useContext(LocaleContext);
    const { viewAmount, onSetPaymentPayload } = useContext(ViewModelContext);
    const { obscureCardCvv, requireCardHolder } = useContext(CustomizationContext);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, dirtyFields },
    } = useForm<CardFormInputs>({ mode: 'onChange' });

    const onSubmit: SubmitHandler<CardFormInputs> = (values) => {
        onSetPaymentPayload({
            methodName,
            values,
        });
    };

    const isSecureCode = isSecureCodeAvailable(watch('cardNumber'));

    return (
        <>
            <HeaderWrapper>
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
