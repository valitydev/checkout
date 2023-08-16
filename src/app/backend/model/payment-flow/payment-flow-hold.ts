import { HoldExpirationType } from './hold-expiration-type';
import { PaymentFlow } from './payment-flow';

export class PaymentFlowHold extends PaymentFlow {
    onHoldExpiration: HoldExpirationType;
}
