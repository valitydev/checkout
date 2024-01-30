import { InvoiceChangeType } from 'checkout/backend';

import { PaymentCondition } from './types';
import {
    StartPaymentPayload,
    TerminalValuesMetadata,
    createPayment,
    determineModel,
    extractServiceProviderMetadata,
    pollInvoiceEvents,
    pollingResToPaymentCondition,
} from '../paymentMgmt';
import { PaymentModel, PaymentModelInvoiceTemplate, PaymentTerminal } from '../paymentModel';
import { getMetadata, isNil } from '../utils';

const provideInstantPayment = async (
    model: PaymentModelInvoiceTemplate,
    provider: string,
    metadata?: TerminalValuesMetadata,
): Promise<PaymentCondition> => {
    try {
        const modelInvoice = await determineModel(model);
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
        const serviceProviderMetadata = extractServiceProviderMetadata(paymentMethods, startPaymentPayload);
        const { eventId, condition } = pollingResToPaymentCondition(pollingResult, serviceProviderMetadata);
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

const fromPaymentTerminal = async (
    model: PaymentModelInvoiceTemplate,
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

const fromInvoiceTemplate = async (model: PaymentModelInvoiceTemplate): Promise<PaymentCondition> => {
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
            return fromPaymentTerminal(model, paymentMethod);
    }
};

export const initPaymentCondition = (model: PaymentModel): Promise<PaymentCondition> => {
    switch (model.type) {
        case 'InvoiceTemplateContext':
            return fromInvoiceTemplate(model);
        case 'InvoiceContext':
            throw new Error('Unimplemented InvoiceContext payment model type');
    }
};
