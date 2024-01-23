import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { CardHolder } from './CardHolder';
import { CardNumber } from './CardNumber';
import { ExpireDate } from './ExpireDate';
import { SecureCode } from './SecureCode';
import { isSecureCodeAvailable } from './utils';
import { CustomizationContext, LocaleContext } from '../../../../common/contexts';
import { FormGroup, PayButton } from '../../../../components/legacy';
import { PaymentFormViewModelContext } from '../PaymentFormViewModelContext';

export type CardFormInputs = {
    cardNumber: string;
    expireDate: string;
    secureCode: string;
    cardHolder: string;
    amount: string;
};

export function CardForm() {
    const { l } = useContext(LocaleContext);
    const { obscureCardCvv, requireCardHolder } = useContext(CustomizationContext);
    const { paymentFormViewModel } = useContext(PaymentFormViewModelContext);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, dirtyFields, isSubmitted },
    } = useForm<CardFormInputs>({ mode: 'onChange' });

    const onSubmit: SubmitHandler<CardFormInputs> = (values) => {
        console.log(values);
    };

    const isSecureCode = isSecureCodeAvailable(watch('cardNumber'));

    return (
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
            <PayButton l={l} viewAmount={paymentFormViewModel.viewAmount} />
        </form>
    );
}
