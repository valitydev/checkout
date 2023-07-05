import { CardData, PaymentMethodName, PaymentTool, PaymentToolType } from 'checkout/backend';
import { CardFormValues, PaymentTerminalFormValues, WalletFormValues } from 'checkout/hooks';
import replaceSpaces from 'checkout/utils/replace-spaces';
import { FormData } from '../types';

const toPaymentToolBankCard = (values: CardFormValues): CardData => {
    const cardNumber = replaceSpaces(values.cardNumber);
    const expDate = replaceSpaces(values.expireDate);
    return {
        paymentToolType: PaymentToolType.CardData,
        cardNumber,
        expDate,
        cvv: values.secureCode,
        cardHolder: values.cardHolder
    };
};

const toPaymentToolDigitalWallet = (values: WalletFormValues) => ({
    paymentToolType: PaymentToolType.DigitalWalletData,
    ...values
});

const toPaymentToolTerminal = (values: PaymentTerminalFormValues) => ({
    paymentToolType: PaymentToolType.PaymentTerminalData,
    provider: values.provider,
    metadata: values.metadata
});

export const toPaymentTool = (formValues: FormData): PaymentTool => {
    switch (formValues.method) {
        case PaymentMethodName.BankCard:
            return toPaymentToolBankCard(formValues.values);
        case PaymentMethodName.DigitalWallet:
            return toPaymentToolDigitalWallet(formValues.values as WalletFormValues);
        case PaymentMethodName.PaymentTerminal:
            return toPaymentToolTerminal(formValues.values as PaymentTerminalFormValues);
    }
};
