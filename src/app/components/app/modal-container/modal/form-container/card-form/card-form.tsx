import * as React from 'react';
import { useContext, useEffect } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';

import { FormGroup } from '../form-group';
import { CardHolder, CardNumber, ExpireDate, SecureCode } from './fields';
import { CardFormInfo, CardFormValues, FormName, PaymentStatus, ResultFormInfo, ResultType } from 'checkout/state';
import { goToFormInfo, pay, prepareToPay, setViewInfoError } from 'checkout/actions';
import { PayButton } from '../pay-button';
import { Header } from '../header/header';
import { toAmountConfig, toCardHolderConfig } from '../fields-config';
import { Amount } from '../common-fields';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { getActiveModalFormSelector } from 'checkout/selectors';
import { InitialContext } from '../../../../initial-context';
import { PaymentMethodName, useCreatePayment } from 'checkout/hooks';

const CardFormDef = ({ submitFailed, initialize, handleSubmit }: InjectedFormProps) => {
    const {
        locale,
        initConfig,
        model: { invoiceTemplate }
    } = useContext(InitialContext);
    const { createPaymentState, setFormData } = useCreatePayment();
    const { paymentStatus } = useAppSelector<CardFormInfo>(getActiveModalFormSelector);
    const cardHolder = toCardHolderConfig(initConfig.requireCardHolder);
    const amount = toAmountConfig(initConfig, invoiceTemplate);
    const formValues = useAppSelector(({ form }) => form?.cardForm?.values);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setViewInfoError(false));
        switch (paymentStatus) {
            case PaymentStatus.pristine:
                initialize({
                    amount: formValues?.amount
                });
                break;
            case PaymentStatus.needRetry:
                submit(formValues);
                break;
        }
    }, []);

    useEffect(() => {
        if (submitFailed) {
            dispatch(setViewInfoError(true));
        }
        if (createPaymentState.status === 'SUCCESS') {
            dispatch(pay(createPaymentState.data));
        }
        if (createPaymentState.status === 'FAILURE') {
            dispatch(goToFormInfo(new ResultFormInfo(ResultType.hookError, createPaymentState.error)));
        }
    }, [submitFailed, createPaymentState]);

    const submit = (values: CardFormValues) => {
        dispatch(prepareToPay());
        setFormData({ method: PaymentMethodName.BankCard, values });
    };

    return (
        <form onSubmit={handleSubmit(submit)}>
            <div>
                <Header title={locale['form.header.pay.card.label']} />
                <FormGroup>
                    <CardNumber locale={locale} />
                </FormGroup>
                <FormGroup>
                    <ExpireDate locale={locale} />
                    <SecureCode
                        locale={locale}
                        obscureCardCvv={initConfig?.obscureCardCvv}
                        cardNumber={formValues?.cardNumber}
                    />
                </FormGroup>
                {cardHolder.visible && (
                    <FormGroup>
                        <CardHolder locale={locale} />
                    </FormGroup>
                )}
                {amount.visible && (
                    <FormGroup>
                        <Amount cost={amount.cost} locale={locale} localeCode={initConfig.locale} />
                    </FormGroup>
                )}
            </div>
            <PayButton />
        </form>
    );
};

export const CardForm = reduxForm({
    form: FormName.cardForm,
    destroyOnUnmount: false
})(CardFormDef);
