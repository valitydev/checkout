import { FlowType } from './flow-type';
import { HoldExpirationType } from './hold-expiration-type';
import { PaymentFlow } from './payment-flow';

export class PaymentFlowHold extends PaymentFlow {
    type: FlowType.PaymentFlowHold;
    onHoldExpiration: HoldExpirationType;
}
