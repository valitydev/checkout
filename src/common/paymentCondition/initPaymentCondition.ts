import { InvoiceChangeType, InvoiceStatus, getInvoiceEvents } from 'checkout/backend';

import { getLastPaymentStartedInfo } from './getLastPaymentStartedInfo';
import { PaymentCondition } from './types';
import {
    StartPaymentPayload,
    TerminalValuesMetadata,
    createPayment,
    determineModel,
    getServiceProviderMetadata,
    pollInvoiceEvents,
    pollingResToPaymentCondition,
} from '../paymentMgmt';
import { applyPaymentInteractionRequested } from '../paymentMgmt/utils';
import { PaymentModel, PaymentModelInvoice, PaymentTerminal } from '../paymentModel';
import { getMetadata, isNil } from '../utils';

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
    metadata?: TerminalValuesMetadata,
): Promise<PaymentCondition> => {
    try {
        const modelInvoice = await getModelInvoice(model);
        const startPaymentPayload: StartPaymentPayload = {
            methodName: 'PaymentTerminal',
            values: { provider, metadata },
        };
        await createPayment(modelInvoice, startPaymentPayload);
        const {
            apiEndpoint,
            invoiceParams: { invoiceID, invoiceAccessToken },
            paymentMethods,
        } = modelInvoice;
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

        const { userInteraction } = getServiceProviderMetadata(paymentMethods, provider);
        const { eventId, condition } = pollingResToPaymentCondition(pollingResult, userInteraction?.type);
        return condition;
    } catch (ex) {
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
    const { id, metadata } = paymentMethod.providers[0];
    const { form, prefilledMetadataValues } = getMetadata(metadata);
    if (isNil(metadata) || isNil(form)) {
        return provideInstantPayment(model, id, { ...prefilledMetadataValues });
    }

    const terminalFormValues = model.initContext.terminalFormValues;
    const isFormRenderRequired = form.reduce((result, curr) => {
        if (result) {
            return result;
        }
        return isNil(terminalFormValues) || isNil(terminalFormValues[curr.name]);
    }, false);
    if (!isFormRenderRequired) {
        return provideInstantPayment(model, id, { ...terminalFormValues, ...prefilledMetadataValues });
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
    switch (paymentMethod.name) {
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
    const { invoiceParams, apiEndpoint } = model;
    const events = await getInvoiceEvents(
        apiEndpoint,
        invoiceParams.invoiceAccessToken,
        invoiceParams.invoiceID,
        GET_INVOICE_EVENTS_LIMIT,
    );
    const { userInteraction, paymentId, provider } = getLastPaymentStartedInfo(events);
    if (!isNil(userInteraction)) {
        const metadata = getServiceProviderMetadata(model.paymentMethods, provider);
        return applyPaymentInteractionRequested(userInteraction, metadata?.userInteraction?.type);
    }
    if (!isNil(paymentId)) {
        return {
            name: 'pending',
        };
    }
    return providePaymentModel(model);
};

const provideInvoice = async (model: PaymentModelInvoice): Promise<PaymentCondition> => {
    switch (model.status) {
        case InvoiceStatus.cancelled:
        case InvoiceStatus.fulfilled:
        case InvoiceStatus.paid:
        case InvoiceStatus.refunded:
            return { name: 'processed' };
        case InvoiceStatus.unpaid:
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
