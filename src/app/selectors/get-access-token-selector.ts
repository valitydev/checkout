import { State } from 'checkout/state';
import { CustomerInitConfig, IntegrationType, InvoiceInitConfig, InvoiceTemplateInitConfig } from 'checkout/config';

export const getAccessTokenSelector = ({ config: { initConfig } }: State) => {
    switch (initConfig.integrationType) {
        case IntegrationType.invoice:
            return (initConfig as InvoiceInitConfig).invoiceAccessToken;
        case IntegrationType.invoiceTemplate:
            return (initConfig as InvoiceTemplateInitConfig).invoiceTemplateAccessToken;
        case IntegrationType.customer:
            return (initConfig as CustomerInitConfig).customerAccessToken;
        default:
            console.error('Unknown integration type');
            return null;
    }
};
