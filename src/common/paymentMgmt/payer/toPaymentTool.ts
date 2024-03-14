import { CardData, PaymentTerminalData, PaymentTool } from '../../backend/payments';
import { replaceSpaces } from '../../utils';
import { BankCardValues, StartPaymentPayload, TerminalValues } from '../types';

const DEFAULT_CVV = '123';

const toPaymentToolBankCard = (values: BankCardValues): CardData => {
    const cardNumber = replaceSpaces(values.cardNumber);
    const expDate = replaceSpaces(values.expireDate);
    return {
        paymentToolType: 'CardData',
        cardNumber,
        expDate,
        cvv: values.secureCode || DEFAULT_CVV,
        cardHolder: values.cardHolder,
    };
};

const toPaymentToolTerminal = (values: TerminalValues): PaymentTerminalData => ({
    paymentToolType: 'PaymentTerminalData',
    provider: values.provider,
    metadata: values.metadata,
});

export const toPaymentTool = (payload: StartPaymentPayload): PaymentTool => {
    switch (payload.methodName) {
        case 'BankCard':
            return toPaymentToolBankCard(payload.values);
        case 'PaymentTerminal':
            return toPaymentToolTerminal(payload.values);
    }
};
