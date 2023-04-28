import { InitConfig, IntegrationType } from 'checkout/config';
import { resolveInvoiceTemplate } from './resolve-invoice-template';
import { resolveInvoice } from './resolve-invoice';
import { Model } from '../fetch-model';
import { AmountInfo } from './types';

export const getAmountInfo = (initConfig: InitConfig, model: Model): AmountInfo => {
    switch (initConfig.integrationType) {
        case IntegrationType.invoice:
            return resolveInvoice(model.invoice, initConfig.locale);
        case IntegrationType.invoiceTemplate:
            return resolveInvoiceTemplate(model.invoiceTemplate, initConfig.amount, initConfig.locale);
    }
};
