import * as React from 'react';

import { PaymentTerminalPaymentMethod } from 'checkout/state';
import { MetadataContent } from './metadata-content';
import { CategoryContent } from './category-content';

export const Content: React.FC<{ method: PaymentTerminalPaymentMethod; localeCode: string }> = ({
    method,
    localeCode
}) => {
    if (method.serviceProviders.length === 1) {
        return <MetadataContent serviceProvider={method.serviceProviders[0]} localeCode={localeCode} />;
    }
    if (method.serviceProviders.length > 1) {
        return <CategoryContent category={method.category} />;
    }
};