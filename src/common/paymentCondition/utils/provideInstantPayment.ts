import { StartPaymentPayload, createPayment, determineModel, pollInvoiceEvents } from 'checkout/paymentMgmt';
import { ContactInfoValues } from 'checkout/paymentMgmt/types';
import { InitContextContactInfo, InvoiceContext, PaymentModel } from 'checkout/paymentModel';
import { extractError } from 'checkout/utils';
import { findMetadata } from 'checkout/utils/findMetadata';

import { pollingResultToConditions } from './pollingResultToConditions';
import { toDefaultFormValuesMetadata } from './toDefaultFormValuesMetadata';
import { InvoiceDetermined, PaymentCondition } from '../types';

const getInvoiceContext = async (model: PaymentModel): Promise<InvoiceContext> => {
    switch (model.type) {
        case 'InvoiceContext':
            return model;
        case 'InvoiceTemplateContext':
            return determineModel(model);
    }
};

const getContactInfo = (contactInfo: InitContextContactInfo): ContactInfoValues => ({
    email: contactInfo?.email,
    phoneNumber: contactInfo?.phoneNumber,
});

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
                contactInfo: getContactInfo(contactInfo),
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
            stopPollingTypes: ['PaymentStatusChanged', 'PaymentInteractionRequested'],
            delays: {
                pollingTimeout: DEFAULT_TIMEOUT_MS,
                apiMethodCall: API_METHOD_CALL_MS,
            },
        });
        const invoiceDetermined: InvoiceDetermined = {
            name: 'invoiceDetermined',
            invoiceContext,
        };
        const isInstantPayment = true;
        const conditions = pollingResultToConditions(pollingResult, skipUserInteraction, isInstantPayment);
        return [invoiceDetermined, ...conditions];
    } catch (exception) {
        console.error(`provideInstantPayment error. ${extractError(exception)}`);
        return [
            {
                name: 'paymentProcessFailed',
                exception,
            },
        ];
    }
};
