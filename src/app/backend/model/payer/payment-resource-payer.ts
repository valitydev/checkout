import { Payer } from './payer';
import { ContactInfo } from '../contact-info';
import { PaymentToolDetails } from '../payment-tool-details';

export type SessionInfo = {
    redirectUrl: string;
};

export class PaymentResourcePayer extends Payer {
    paymentToolToken: string;
    paymentSession: string;
    contactInfo: ContactInfo;
    sessionInfo?: SessionInfo;
    paymentToolDetails?: PaymentToolDetails;
}
