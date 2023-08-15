import { PaymentError } from 'checkout/backend';

import { Payer } from './payer';
import { PaymentFlow } from './payment-flow';
import { PaymentStatus } from './payment-status';

export class Payment {
    id: string;
    invoiceID: string;
    createdAt: string;
    amount: number;
    currency: string;
    flow: PaymentFlow;
    payer: Payer;
    status: PaymentStatus;
    error: PaymentError;
    externalID: string;
}
