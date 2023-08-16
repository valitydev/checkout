import { PaymentMethod } from './payment-method';
import { PaymentSystem } from './payment-system';

export class BankCard extends PaymentMethod {
    paymentSystems: PaymentSystem[];
}
