import * as React from 'react';

import { PaymentTerminalPaymentMethod } from 'checkout/hooks';

import { CategoryContent } from './category-content';
import { MetadataContent } from './metadata-content';

export const Content: React.FC<{
    method: PaymentTerminalPaymentMethod;
    localeCode: string;
}> = ({ method, localeCode }) => {
    if (method.serviceProviders.length === 1) {
        return <MetadataContent localeCode={localeCode} serviceProvider={method.serviceProviders[0]} />;
    }
    if (method.serviceProviders.length > 1) {
        return <CategoryContent category={method.category} />;
    }
};
