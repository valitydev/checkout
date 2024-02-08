import {
    InvoiceStatuses,
    ServiceProviderContactInfo,
    ServiceProviderMetadataForm,
    getInvoiceEvents,
} from 'checkout/backend';

import { PaymentCondition } from './types';
import { invoiceEventsToConditions, provideInstantPayment } from './utils';
import { InitContext, PaymentModel, PaymentModelInvoice, PaymentTerminal } from '../paymentModel';
import { findMetadata, isNil, last } from '../utils';

const isContactInfoInstantPayment = (metadata: ServiceProviderContactInfo, initContext: InitContext): boolean => {
    const { email, phoneNumber } = metadata;
    const { contactInfo } = initContext;
    if (email && !isNil(contactInfo.email)) {
        return true;
    }
    if (phoneNumber && !isNil(contactInfo.phoneNumber)) {
        return true;
    }
    return false;
};

const isFormInstantPayment = (form: ServiceProviderMetadataForm, initContext: InitContext): boolean => {
    if (isNil(form)) {
        return true;
    }
    const terminalFormValues = initContext?.terminalFormValues;
    const isFormRenderRequired = form.reduce((result, curr) => {
        if (result) {
            return result;
        }
        return isNil(terminalFormValues) || isNil(terminalFormValues[curr.name]);
    }, false);
    if (!isFormRenderRequired) {
        return true;
    }
    return false;
};

const providePaymentTerminal = async (
    model: PaymentModel,
    paymentMethod: PaymentTerminal,
    lastEventId: number,
): Promise<PaymentCondition[]> => {
    if (paymentMethod.providers.length > 1) {
        return [];
    }
    const provider = paymentMethod.providers[0];
    const { form, contactInfo } = findMetadata(model.serviceProviders, provider);
    if (!isContactInfoInstantPayment(contactInfo, model.initContext)) {
        return [];
    }
    if (!isFormInstantPayment(form, model.initContext)) {
        return [];
    }
    return provideInstantPayment(model, provider, lastEventId);
};

const providePaymentModel = async (model: PaymentModel, lastEventId: number): Promise<PaymentCondition[]> => {
    if (model.paymentMethods.length > 1) {
        return [];
    }
    const paymentMethod = model.paymentMethods[0];
    switch (paymentMethod.methodName) {
        case 'BankCard':
            return [];
        case 'PaymentTerminal':
            return providePaymentTerminal(model, paymentMethod, lastEventId);
    }
};

const GET_INVOICE_EVENTS_LIMIT = 50;

const provideInvoiceUnpaid = async (model: PaymentModelInvoice): Promise<PaymentCondition[]> => {
    let lastEventId = 0;
    try {
        const {
            invoiceParams,
            apiEndpoint,
            initContext: { skipUserInteraction },
        } = model;
        const events = await getInvoiceEvents(
            apiEndpoint,
            invoiceParams.invoiceAccessToken,
            invoiceParams.invoiceID,
            GET_INVOICE_EVENTS_LIMIT,
        );
        const conditions = invoiceEventsToConditions(events, skipUserInteraction);
        lastEventId = last(events).id;
        const lastCondition = last(conditions);
        switch (lastCondition.name) {
            case 'paymentStarted':
            case 'interactionRequested':
                return conditions;
        }
    } catch (exception) {
        return [
            {
                name: 'paymentProcessFailed',
                exception,
            },
        ];
    }
    return providePaymentModel(model, lastEventId);
};

const provideInvoice = async (model: PaymentModelInvoice): Promise<PaymentCondition[]> => {
    switch (model.status) {
        case InvoiceStatuses.cancelled:
        case InvoiceStatuses.fulfilled:
        case InvoiceStatuses.paid:
        case InvoiceStatuses.refunded:
            return [{ name: 'invoiceStatusChanged', status: model.status }];
        case InvoiceStatuses.unpaid:
            return provideInvoiceUnpaid(model);
    }
};

export const initPaymentCondition = async (model: PaymentModel): Promise<PaymentCondition[]> => {
    switch (model.type) {
        case 'InvoiceTemplateContext':
            // Invoice template context does not have last event id
            const lastEventId = 0;
            return providePaymentModel(model, lastEventId);
        case 'InvoiceContext':
            const conditions = await provideInvoice(model);
            const invoiceDetermined = conditions.find((c) => c.name === 'invoiceDetermined');
            if (isNil(invoiceDetermined)) {
                return [{ name: 'invoiceDetermined', invoiceContext: model }, ...conditions];
            }
            return conditions;
    }
};
