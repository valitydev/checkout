import { PaymentMethod, PaymentMethodName } from './payment-method';
import { PaymentSystem } from './payment-system';

export class BankCard extends PaymentMethod {
    method: PaymentMethodName.BankCard;
    paymentSystems: PaymentSystem[];
}
