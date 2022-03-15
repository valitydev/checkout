import { PaymentMethod } from './payment-method';
import { PaymentMethodName } from './payment-method-name';

export interface UPIPaymentMethod extends PaymentMethod {
    name: PaymentMethodName.UPI;
}
