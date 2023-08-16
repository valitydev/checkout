import { Payer } from './payer';
import { PaymentFlow } from './payment-flow';

export class PaymentParams {
    flow: PaymentFlow;
    payer: Payer;
    makeRecurrent: boolean;
}
