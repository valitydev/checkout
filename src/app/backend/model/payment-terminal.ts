import { PaymentMethod, PaymentMethodName } from './payment-method';
import { TerminalProviderCategories } from './terminal-provider-categories';

export class PaymentTerminal extends PaymentMethod {
    method: PaymentMethodName.PaymentTerminal;
    providers: TerminalProviderCategories[];
}
