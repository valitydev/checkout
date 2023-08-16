import { ServiceProvider } from 'checkout/backend';

import { KnownProviderCategories } from './known-provider-categories';
import { PaymentMethod } from './payment-method';
import { PaymentMethodName } from './payment-method-name';

export interface PaymentTerminalPaymentMethod extends PaymentMethod {
    name: PaymentMethodName.PaymentTerminal;
    category: KnownProviderCategories;
    serviceProviders: ServiceProvider[];
}
