import { InvoiceChangeType, InvoiceStatuses, getInvoiceEvents } from 'checkout/backend';

import { PaymentCondition } from './types';
import { invoiceEventsToConditions, pollingResultToConditions } from './utils';
import { StartPaymentPayload, createPayment, determineModel, pollInvoiceEvents } from '../paymentMgmt';
import { PaymentModel, PaymentModelInvoice, PaymentTerminal } from '../paymentModel';
import { findMetadata, isNil, last } from '../utils';

const getModelInvoice = async (model: PaymentModel): Promise<PaymentModelInvoice> => {
    switch (model.type) {
        case 'InvoiceContext':
            return model;
        case 'InvoiceTemplateContext':
            return determineModel(model);
    }
};

const provideInstantPayment = async (
    model: PaymentModel,
    provider: string,
    lastEventId: number,
): Promise<PaymentCondition[]> => {
    try {
        const modelInvoice = await getModelInvoice(model);
        const {
            apiEndpoint,
            invoiceParams: { invoiceID, invoiceAccessToken },
            initContext,
            serviceProviders,
        } = modelInvoice;
        const { prefilledMetadataValues } = findMetadata(serviceProviders, provider);
        const startPaymentPayload: StartPaymentPayload = {
            methodName: 'PaymentTerminal',
            values: {
                provider,
                metadata: {
                    ...initContext?.terminalFormValues,
                    ...prefilledMetadataValues,
                },
            },
        };
        await createPayment(modelInvoice, startPaymentPayload);
        const DEFAULT_TIMEOUT_MS = 60 * 1000 * 3;
        const API_METHOD_CALL_MS = 1000;
        const pollingResult = await pollInvoiceEvents({
            apiEndpoint,
            invoiceAccessToken,
            invoiceID,
            startFromEventID: lastEventId,
            stopPollingTypes: [InvoiceChangeType.PaymentStatusChanged, InvoiceChangeType.PaymentInteractionRequested],
            delays: {
                pollingTimeout: DEFAULT_TIMEOUT_MS,
                apiMethodCall: API_METHOD_CALL_MS,
            },
        });
        return pollingResultToConditions(pollingResult);
    } catch (ex) {
        console.error(ex);
        return [
            {
                name: 'paymentProcessFailed',
                exception: {
                    type: 'ApiCallException',
                },
            },
        ];
    }
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
    const { form } = findMetadata(model.serviceProviders, provider);
    if (isNil(form)) {
        return provideInstantPayment(model, provider, lastEventId);
    }

    const terminalFormValues = model.initContext.terminalFormValues;
    const isFormRenderRequired = form.reduce((result, curr) => {
        if (result) {
            return result;
        }
        return isNil(terminalFormValues) || isNil(terminalFormValues[curr.name]);
    }, false);
    if (!isFormRenderRequired) {
        return provideInstantPayment(model, provider, lastEventId);
    }
    return [];
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

const GET_INVOICE_EVENTS_LIMIT = 20;

const provideInvoiceUnpaid = async (model: PaymentModelInvoice): Promise<PaymentCondition[]> => {
    let lastEventId = 0;
    try {
        const { invoiceParams, apiEndpoint } = model;
        const events = await getInvoiceEvents(
            apiEndpoint,
            invoiceParams.invoiceAccessToken,
            invoiceParams.invoiceID,
            GET_INVOICE_EVENTS_LIMIT,
        );
        const conditions = invoiceEventsToConditions(events);
        lastEventId = last(events).id;
        const lastCondition = last(conditions);
        switch (lastCondition.name) {
            case 'paymentStarted':
            case 'interactionRequested':
                return conditions;
        }
    } catch (ex) {
        console.error(ex);
        return [
            {
                name: 'paymentProcessFailed',
                exception: {
                    type: 'ApiCallException',
                },
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

export const initPaymentCondition = (model: PaymentModel): Promise<PaymentCondition[]> => {
    switch (model.type) {
        case 'InvoiceTemplateContext':
            // Invoice template context does not have last event id
            const lastEventId = 0;
            return providePaymentModel(model, lastEventId);
        case 'InvoiceContext':
            return provideInvoice(model);
    }
};
