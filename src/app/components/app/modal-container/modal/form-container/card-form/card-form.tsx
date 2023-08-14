import * as React from 'react';
import { useContext, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { FormGroup } from '../form-group';
import { CardHolder, CardNumber, ExpireDate, SecureCode } from './fields';
import { ResultFormInfo, ResultType } from 'checkout/hooks';
import { PayButton } from '../pay-button';
import { Header } from '../header';
import { toAmountConfig, toCardHolderConfig } from '../fields-config';
import { Amount } from '../common-fields';
import { PaymentMethodName, useCreatePayment } from 'checkout/hooks';
import { isEmptyObject } from 'checkout/utils/is-empty-object';
import { CardFormInputs } from './card-form-inputs';

import { InitialContext } from '../../../../initial-context';
import { ModalContext } from '../../../modal-context';

export const CardForm = ({ onMount }: { onMount: () => void }) => {
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
                    locale={locale}
                    fieldError={errors.cardNumber}
                    isDirty={dirtyFields.cardNumber}
                    register={register}
                    watch={watch}
                />
            </FormGroup>
            <FormGroup $gap={10}>
                <ExpireDate
                    locale={locale}
                    fieldError={errors.expireDate}
                    isDirty={dirtyFields.expireDate}
                    register={register}
                />
                <SecureCode
                    locale={locale}
                    fieldError={errors.secureCode}
                    isDirty={dirtyFields.secureCode}
                    register={register}
                    obscureCardCvv={initConfig?.obscureCardCvv}
                    cardNumber={watch('cardNumber')}
                />
            </FormGroup>
            {cardHolder.visible && (
                <FormGroup>
                    <CardHolder
                        locale={locale}
                        fieldError={errors.cardHolder}
                        isDirty={dirtyFields.cardHolder}
                        register={register}
                    />
                </FormGroup>
            )}
            {amount.visible && (
                <FormGroup>
                    <Amount
                        cost={amount.cost}
                        locale={locale}
                        localeCode={initConfig.locale}
                        fieldError={errors.amount}
                        isDirty={dirtyFields.amount}
                        register={register}
                    />
                </FormGroup>
            )}
            <PayButton />
        </form>
    );
};
