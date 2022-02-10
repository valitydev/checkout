import { PaymentMethodName } from './payment-method-name';

export interface PaymentMethod {
    name: PaymentMethodName;
    priority?: number;
    subMethods?: PaymentMethod[];
}
