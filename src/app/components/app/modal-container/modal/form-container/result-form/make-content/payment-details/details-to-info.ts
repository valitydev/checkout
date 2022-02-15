import { PaymentToolDetailsDigitalWallet, PaymentToolDetailsPaymentTerminal } from 'checkout/backend/model';
import { PaymentToolDetailsBankCard } from 'checkout/backend';

export const toCardInfo = (details: PaymentToolDetailsBankCard): string =>
    `${details.paymentSystem} ${details.cardNumberMask}`;

export const toDigitalWalletInfo = (details: PaymentToolDetailsDigitalWallet): string => details.provider;

export const toTerminalInfo = (details: PaymentToolDetailsPaymentTerminal): string => details.provider;
