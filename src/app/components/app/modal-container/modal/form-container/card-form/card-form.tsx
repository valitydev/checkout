import { useContext, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { ResultFormInfo, ResultType } from 'checkout/hooks';
import { PaymentMethodName, useCreatePayment } from 'checkout/hooks';
import { isEmptyObject } from 'checkout/utils/is-empty-object';

import { CardFormInputs } from './card-form-inputs';
import { CardHolder, CardNumber, ExpireDate, SecureCode } from './fields';
import { InitialContext } from '../../../../initial-context';
import { ModalContext } from '../../../modal-context';
import { Amount } from '../common-fields';
import { toAmountConfig, toCardHolderConfig } from '../fields-config';
import { FormGroup } from '../form-group';
import { Header } from '../header';
import { PayButton } from '../pay-button';

const CardForm = ({ onMount }: { onMount: () => void }) => {
    const {
        locale,
        initConfig,
        model: { invoiceTemplate },
    } = useContext(InitialContext);
    const { setViewInfoError, goToFormInfo, prepareToPay } = useContext(ModalContext);
    const { createPaymentState, setFormData } = useCreatePayment();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, dirtyFields, isSubmitted },
    } = useForm<CardFormInputs>({ mode: 'onChange' });
    const cardHolder = toCardHolderConfig(initConfig.requireCardHolder);
    const amount = toAmountConfig(initConfig, invoiceTemplate);

    useEffect(() => {
        onMount();
    }, []);

    useEffect(() => {
        if (isSubmitted && !isEmptyObject(errors)) {
            setViewInfoError(true);
        }
    }, [isSubmitted, errors]);

    useEffect(() => {
        if (createPaymentState.status === 'FAILURE') {
            goToFormInfo(
                new ResultFormInfo(ResultType.hookError, {
                    error: createPaymentState.error,
                }),
            );
        }
    }, [createPaymentState]);

    const onSubmit: SubmitHandler<CardFormInputs> = (values) => {
        prepareToPay();
        setFormData({ method: PaymentMethodName.BankCard, values });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Header title={locale['form.header.pay.card.label']} />
            <FormGroup>
                <CardNumber
                    fieldError={errors.cardNumber}
                    isDirty={dirtyFields.cardNumber}
                    locale={locale}
                    register={register}
                    watch={watch}
                />
            </FormGroup>
            <FormGroup $gap={10}>
                <ExpireDate
                    fieldError={errors.expireDate}
                    isDirty={dirtyFields.expireDate}
                    locale={locale}
                    register={register}
                />
                <SecureCode
                    cardNumber={watch('cardNumber')}
                    fieldError={errors.secureCode}
                    isDirty={dirtyFields.secureCode}
                    locale={locale}
                    obscureCardCvv={initConfig?.obscureCardCvv}
                    register={register}
                />
            </FormGroup>
            {cardHolder.visible && (
                <FormGroup>
                    <CardHolder
                        fieldError={errors.cardHolder}
                        isDirty={dirtyFields.cardHolder}
                        locale={locale}
                        register={register}
                    />
                </FormGroup>
            )}
            {amount.visible && (
                <FormGroup>
                    <Amount
                        cost={amount.cost}
                        fieldError={errors.amount}
                        isDirty={dirtyFields.amount}
                        locale={locale}
                        localeCode={initConfig.locale}
                        register={register}
                    />
                </FormGroup>
            )}
            <PayButton />
        </form>
    );
};

export default CardForm;
