import { PaymentToolDetails } from './payment-tool-details';
import { PaymentToolDetailsType } from './payment-tool-details-type';

export class PaymentToolDetailsDigitalWallet implements PaymentToolDetails {
    detailsType: PaymentToolDetailsType.PaymentToolDetailsDigitalWallet;
    provider: string;
}
