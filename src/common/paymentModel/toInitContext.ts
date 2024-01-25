import { InitConfig } from 'checkout/config';
import { InitParams } from 'checkout/initialize';

import { InitContext, InvoiceContext, InvoiceTemplateContext } from './model';
import { isNil } from '../utils';

const isInvoiceParams = (params: InitConfig): params is InvoiceContext => params.integrationType === 'invoice';
const isInvoiceTemplateParams = (params: InitConfig): params is InvoiceTemplateContext =>
    params.integrationType === 'invoiceTemplate';

const toInvoiceContext = (initConfig: InitConfig): InvoiceContext | InvoiceTemplateContext => {
    if (isInvoiceTemplateParams(initConfig)) {
        if (isNil(initConfig.invoiceTemplateID) || isNil(initConfig.invoiceTemplateAccessToken)) {
            throw new Error('Missing required fields for InvoiceTemplateContext');
        }
        return {
            type: 'InvoiceTemplateContext',
            invoiceTemplateID: initConfig.invoiceTemplateID,
            invoiceTemplateAccessToken: initConfig.invoiceTemplateAccessToken,
        };
    }
    if (isInvoiceParams(initConfig)) {
        if (isNil(initConfig.invoiceID) || isNil(initConfig.invoiceAccessToken)) {
            throw new Error('Missing required fields for InvoiceContext');
        }
        return {
            type: 'InvoiceContext',
            invoiceID: initConfig.invoiceID,
            invoiceAccessToken: initConfig.invoiceAccessToken,
        };
    }
    throw new Error('Invalid InitConfig for InvoiceContexts');
};

const toContactInfo = ({ phoneNumber, email }: InitConfig) => {
    if (isNil(phoneNumber) && isNil(email)) {
        return undefined;
    }
    return {
        phoneNumber,
        email,
    };
};

export const toInitContext = ({ appConfig, initConfig }: InitParams): InitContext => ({
    invoiceContext: toInvoiceContext(initConfig),
    apiEndpoint: appConfig.capiEndpoint,
    terminalFormValues: initConfig.terminalFormValues,
    paymentMetadata: initConfig.metadata,
    isExternalIDIncluded: initConfig.isExternalIDIncluded,
    contactInfo: toContactInfo(initConfig),
});
