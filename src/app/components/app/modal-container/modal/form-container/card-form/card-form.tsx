import * as React from 'react';
import { useContext, useEffect } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';

import { FormGroup } from '../form-group';
import { CardHolder, CardNumber, ExpireDate, SecureCode } from './fields';
import { FormName, PaymentStatus, ResultFormInfo, ResultType } from 'checkout/hooks';
import { PayButton } from '../pay-button';
import { Header } from '../header/header';
import { toAmountConfig, toCardHolderConfig } from '../fields-config';
import { Amount } from '../common-fields';
import { useAppSelector } from 'checkout/configure-store';
import { PaymentMethodName, useCreatePayment } from 'checkout/hooks';

import { InitialContext } from '../../../../initial-context';
import { ModalContext } from '../../../modal-context';
import { useActiveModalForm } from '../use-active-modal-form';
import { CardFormValues } from 'checkout/state';

const CardFormDef = ({ submitFailed, initialize, handleSubmit }: InjectedFormProps) => {
    const {
        locale,
        initConfig,
        model: { invoiceTemplate }
    } = useContext(InitialContext);
    const { modalState, setViewInfoError, goToFormInfo, prepareToPay } = useContext(ModalContext);
    const { createPaymentState, setFormData } = useCreatePayment();
    const { paymentStatus } = useActiveModalForm(modalState);
    const cardHolder = toCardHolderConfig(initConfig.requireCardHolder);
    const amount = toAmountConfig(initConfig, invoiceTemplate);
    const formValues = useAppSelector(({ form }) => form?.cardForm?.values);

    useEffect(() => {
        setViewInfoError(false);
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
            setViewInfoError(true);
        }
        if (createPaymentState.status === 'FAILURE') {
            goToFormInfo(
                new ResultFormInfo(ResultType.hookError, {
                    error: createPaymentState.error
                })
            );
        }
    }, [submitFailed, createPaymentState]);

    const submit = (values: CardFormValues) => {
        prepareToPay();
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
