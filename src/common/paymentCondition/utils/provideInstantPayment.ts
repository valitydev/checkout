import { InvoiceChangeType } from 'checkout/backend';

import { pollingResultToConditions } from './pollingResultToConditions';
import { toDefaultFormValuesMetadata } from './toDefaultFormValuesMetadata';
import { StartPaymentPayload, createPayment, determineModel, pollInvoiceEvents } from '../../paymentMgmt';
import { InvoiceContext, PaymentModel } from '../../paymentModel';
import { extractError } from '../../utils';
import { findMetadata } from '../../utils/findMetadata';
import { InvoiceDetermined, PaymentCondition } from '../types';

const getInvoiceContext = async (model: PaymentModel): Promise<InvoiceContext> => {
    switch (model.type) {
        case 'InvoiceContext':
            return model;
        case 'InvoiceTemplateContext':
            return determineModel(model);
    }
};

export const provideInstantPayment = async (
    model: PaymentModel,
    provider: string,
    lastEventId: number,
): Promise<PaymentCondition[]> => {
    try {
        const {
            apiEndpoint,
            initContext: { terminalFormValues, contactInfo, skipUserInteraction },
            serviceProviders,
        } = model;
        const invoiceContext = await getInvoiceContext(model);
        const {
            invoiceParams: { invoiceID, invoiceAccessToken },
        } = invoiceContext;
        const { prefilledMetadataValues, form } = findMetadata(serviceProviders, provider);

        const startPaymentPayload: StartPaymentPayload = {
            methodName: 'PaymentTerminal',
            values: {
                provider,
                contactInfo,
                metadata: {
                    ...toDefaultFormValuesMetadata(terminalFormValues, form),
                    ...prefilledMetadataValues,
                },
            },
        };
        await createPayment(model, invoiceContext, startPaymentPayload);
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
        const invoiceDetermined: InvoiceDetermined = {
            name: 'invoiceDetermined',
            invoiceContext,
        };
        const conditions = pollingResultToConditions(pollingResult, skipUserInteraction);
        return [invoiceDetermined, ...conditions];
    } catch (exception) {
        console.error('provideInstantPayment error:', extractError(exception));
        return [
            {
                name: 'paymentProcessFailed',
                exception,
            },
        ];
    }
};
