import { InitConfig } from 'checkout/config';

import { InvoiceContext, InvoiceTemplateContext } from './types';
import { isNil } from '../utils';

export const toInvoiceContext = (initConfig: InitConfig): InvoiceTemplateContext | InvoiceContext => {
    if (initConfig.integrationType === 'invoiceTemplate') {
        if (isNil(initConfig.invoiceTemplateID) || isNil(initConfig.invoiceTemplateAccessToken)) {
            throw new Error('Missing required fields for InvoiceTemplateContext');
        }
        return {
            type: 'InvoiceTemplateContext',
            invoiceTemplateParams: {
                invoiceTemplateID: initConfig.invoiceTemplateID,
                invoiceTemplateAccessToken: initConfig.invoiceTemplateAccessToken,
            },
        };
    }
    if (initConfig.integrationType === 'invoice') {
        if (isNil(initConfig.invoiceID) || isNil(initConfig.invoiceAccessToken)) {
            throw new Error('Missing required fields for InvoiceContext');
        }
        return {
            type: 'InvoiceContext',
            invoiceParams: {
                invoiceID: initConfig.invoiceID,
                invoiceAccessToken: initConfig.invoiceAccessToken,
            },
        };
    }
    throw new Error('Invalid InitConfig for InvoiceContexts');
};
