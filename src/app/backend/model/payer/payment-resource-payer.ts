import { Payer } from './payer';
import { ContactInfo } from '../contact-info';
import { PayerType } from './payer-type';
import { PaymentToolDetails } from '../payment-tool-details';

export class PaymentResourcePayer extends Payer {
    payerType: PayerType.PaymentResourcePayer;
    paymentToolToken: string;
    paymentSession: string;
    contactInfo: ContactInfo;
    sessionInfo?: {
        redirectUrl: string;
    };
    paymentToolDetails?: PaymentToolDetails;
}
