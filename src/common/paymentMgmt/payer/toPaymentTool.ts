import { CardData, PaymentTool, PaymentToolType } from 'checkout/backend';

import { replaceSpaces } from '../../utils';
import { BankCardValues, StartPaymentPayload, TerminalValues } from '../types';

const DEFAULT_CVV = '123';

const toPaymentToolBankCard = (values: BankCardValues): CardData => {
    const cardNumber = replaceSpaces(values.cardNumber);
    const expDate = replaceSpaces(values.expireDate);
    return {
        paymentToolType: PaymentToolType.CardData,
        cardNumber,
        expDate,
        cvv: values.secureCode || DEFAULT_CVV,
        cardHolder: values.cardHolder,
    };
};

const toPaymentToolTerminal = (values: TerminalValues) => ({
    paymentToolType: PaymentToolType.PaymentTerminalData,
    provider: values.provider,
    metadata: values.metadata,
});

export const toPaymentTool = (payload: StartPaymentPayload): PaymentTool => {
    switch (payload.methodName) {
        case 'BankCard':
            return toPaymentToolBankCard(payload.values);
        case 'PaymentTerminal':
            return toPaymentToolTerminal(payload.values);
        case 'DigitalWallet':
            throw new Error('Unimplemented StartPaymentPayload: DigitalWallet');
    }
};
