import { InitConfig } from 'checkout/config';
import { resolveInvoiceTemplate } from './resolve-invoice-template';
import { resolveInvoice } from './resolve-invoice';
import { AmountInfo } from './types';
import { Model } from '..';

export const getAmountInfo = (initConfig: InitConfig, model: Model): AmountInfo => {
    switch (initConfig.integrationType) {
        case 'invoice':
            return resolveInvoice(model.invoice, initConfig.locale);
        case 'invoiceTemplate':
            return resolveInvoiceTemplate(model.invoiceTemplate, initConfig.amount, initConfig.locale);
    }
};
