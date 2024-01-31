import { InvoiceChangeType, InvoiceStatuses, getInvoiceEvents } from 'checkout/backend';

import { getLastPaymentStartedInfo } from './getLastPaymentStartedInfo';
import { PaymentCondition } from './types';
import {
    StartPaymentPayload,
    createPayment,
    determineModel,
    pollInvoiceEvents,
    pollingResToPaymentCondition,
} from '../paymentMgmt';
import { applyPaymentInteractionRequested } from '../paymentMgmt/utils';
import { PaymentModel, PaymentModelInvoice, PaymentTerminal } from '../paymentModel';
import { findMetadata, isNil } from '../utils';

const getModelInvoice = async (model: PaymentModel): Promise<PaymentModelInvoice> => {
    switch (model.type) {
        case 'InvoiceContext':
            return model;
        case 'InvoiceTemplateContext':
            return determineModel(model);
    }
};

const provideInstantPayment = async (model: PaymentModel, provider: string): Promise<PaymentCondition> => {
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
        const pollingResult = await pollInvoiceEvents({
            apiEndpoint,
            invoiceAccessToken,
            invoiceID,
            stopPollingTypes: [
                InvoiceChangeType.InvoiceStatusChanged,
                InvoiceChangeType.PaymentStatusChanged,
                InvoiceChangeType.PaymentInteractionRequested,
            ],
            delays: {
                pollingTimeout: 60 * 1000 * 20,
                apiMethodCall: 1000,
            },
        });

        const { eventId, condition } = pollingResToPaymentCondition(pollingResult, provider);
        return condition;
    } catch (ex) {
        console.error(ex);
        return {
            name: 'paymentProcessFailed',
            exception: {
                type: 'ApiCallException',
            },
        };
    }
};

const providePaymentTerminal = async (
    model: PaymentModel,
    paymentMethod: PaymentTerminal,
): Promise<PaymentCondition> => {
    if (paymentMethod.providers.length > 1) {
        return {
            name: 'uninitialized',
        };
    }
    const provider = paymentMethod.providers[0];
    const { form } = findMetadata(model.serviceProviders, provider);
    if (isNil(form)) {
        return provideInstantPayment(model, provider);
    }

    const terminalFormValues = model.initContext.terminalFormValues;
    const isFormRenderRequired = form.reduce((result, curr) => {
        if (result) {
            return result;
        }
        return isNil(terminalFormValues) || isNil(terminalFormValues[curr.name]);
    }, false);
    if (!isFormRenderRequired) {
        return provideInstantPayment(model, provider);
    }
    return {
        name: 'uninitialized',
    };
};

const providePaymentModel = async (model: PaymentModel): Promise<PaymentCondition> => {
    if (model.paymentMethods.length > 1) {
        return {
            name: 'uninitialized',
        };
    }
    const paymentMethod = model.paymentMethods[0];
    switch (paymentMethod.methodName) {
        case 'BankCard':
            return {
                name: 'uninitialized',
            };
        case 'PaymentTerminal':
            return providePaymentTerminal(model, paymentMethod);
    }
};

const GET_INVOICE_EVENTS_LIMIT = 20;

const provideInvoiceUnpaid = async (model: PaymentModelInvoice): Promise<PaymentCondition> => {
    try {
        const { invoiceParams, apiEndpoint } = model;
        const events = await getInvoiceEvents(
            apiEndpoint,
            invoiceParams.invoiceAccessToken,
            invoiceParams.invoiceID,
            GET_INVOICE_EVENTS_LIMIT,
        );
        const { userInteraction, provider, paymentId } = getLastPaymentStartedInfo(events);
        if (!isNil(userInteraction)) {
            return applyPaymentInteractionRequested(userInteraction, provider);
        }
        if (!isNil(paymentId)) {
            return {
                name: 'paymentStarted',
            };
        }
    } catch (ex) {
        console.error(ex);
        return {
            name: 'paymentProcessFailed',
            exception: {
                type: 'ApiCallException',
            },
        };
    }
    return providePaymentModel(model);
};

const provideInvoice = async (model: PaymentModelInvoice): Promise<PaymentCondition> => {
    switch (model.status) {
        case InvoiceStatuses.cancelled:
        case InvoiceStatuses.fulfilled:
        case InvoiceStatuses.paid:
        case InvoiceStatuses.refunded:
            return { name: 'invoiceStatusChanged', status: model.status };
        case InvoiceStatuses.unpaid:
            return provideInvoiceUnpaid(model);
    }
};

export const initPaymentCondition = (model: PaymentModel): Promise<PaymentCondition> => {
    switch (model.type) {
        case 'InvoiceTemplateContext':
            return providePaymentModel(model);
        case 'InvoiceContext':
            return provideInvoice(model);
    }
};
