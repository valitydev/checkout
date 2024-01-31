import { CommonFormInputs } from '../types';

export type CardFormInputs = {
    cardNumber: string;
    secureCode: string;
    expireDate?: string;
    cardHolder?: string;
} & CommonFormInputs;
