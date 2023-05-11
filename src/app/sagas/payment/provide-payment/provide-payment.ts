import { call, CallEffect } from 'redux-saga/effects';
import { PayableFormValues } from 'checkout/state';
import { payWithBankCard } from './pay-with-bank-card';
import { assertUnreachable } from 'checkout/utils';
import { payWithDigitalWallet } from './pay-with-digital-wallet';
import { payWithPaymentTerminal } from './pay-with-payment-terminal';
import { AppContext } from 'checkout/actions';
import { PaymentMethodName } from 'checkout/hooks';

const getPayFn = (method: PaymentMethodName) => {
    switch (method) {
        case PaymentMethodName.BankCard:
            return call.bind(null, payWithBankCard);
        case PaymentMethodName.DigitalWallet:
            return call.bind(null, payWithDigitalWallet);
        case PaymentMethodName.PaymentTerminal:
            return call.bind(null, payWithPaymentTerminal);
        default:
            assertUnreachable(method);
            throw { code: 'error.unsupported.payment.method' };
    }
};

export function* providePayment(
    method: PaymentMethodName,
    context: AppContext,
    v: PayableFormValues
): Iterator<CallEffect> {
    const values = v ? v : { amount: null, email: null, phoneNumber: null };
    yield getPayFn(method)(context, values);
}
