import { all, call, put, select } from 'redux-saga/effects';
import {
    InvoiceTemplate,
    PaymentMethod,
    Invoice,
    getCustomerEvents,
    getInvoiceEvents,
    getInvoicePaymentMethods,
    getInvoicePaymentMethodsByTemplateID,
    getInvoiceTemplateByID,
    getInvoiceByID,
    Event,
    ServiceProvider
} from 'checkout/backend';
import {
    CustomerInitConfig,
    InitConfig,
    IntegrationType,
    InvoiceInitConfig,
    InvoiceTemplateInitConfig
} from 'checkout/config';
import { InitializeModelCompleted, SetEventsAction, TypeKeys } from 'checkout/actions';
import { State } from 'checkout/state';
import { getServiceProviders } from './service-providers';

export interface ModelChunk {
    invoiceTemplate?: InvoiceTemplate;
    events?: Event[];
    paymentMethods?: PaymentMethod[];
    invoiceAccessToken?: string;
    invoice?: Invoice;
    serviceProviders?: ServiceProvider[];
}

export function* resolveInvoiceTemplate(endpoint: string, config: InvoiceTemplateInitConfig) {
    const token = config.invoiceTemplateAccessToken;
    const id = config.invoiceTemplateID;
    const [invoiceTemplate, paymentMethods] = yield all([
        call(getInvoiceTemplateByID, endpoint, token, id),
        call(getInvoicePaymentMethodsByTemplateID, endpoint, token, id)
    ]);
    const serviceProviders = yield call(getServiceProviders, paymentMethods, endpoint, token);
    return { paymentMethods, invoiceTemplate, serviceProviders };
}

export function* resolveInvoice(endpoint: string, config: InvoiceInitConfig) {
    const token = config.invoiceAccessToken;
    const id = config.invoiceID;
    const [invoice, events, paymentMethods] = yield all([
        call(getInvoiceByID, endpoint, token, id),
        call(getInvoiceEvents, endpoint, token, id),
        call(getInvoicePaymentMethods, endpoint, token, id)
    ]);
    const serviceProviders = yield call(getServiceProviders, paymentMethods, endpoint, token);
    return { paymentMethods, events, invoiceAccessToken: token, invoice, serviceProviders };
}

export function* resolveCustomer(endpoint: string, config: CustomerInitConfig) {
    const token = config.customerAccessToken;
    const id = config.customerID;
    const events = yield call(getCustomerEvents, endpoint, token, id);
    return { events };
}

export function* resolveIntegrationType(endpoint: string, config: InitConfig) {
    let chunk;
    switch (config.integrationType) {
        case IntegrationType.invoiceTemplate:
            chunk = yield call(resolveInvoiceTemplate, endpoint, config as any);
            break;
        case IntegrationType.invoice:
            chunk = yield call(resolveInvoice, endpoint, config as any);
            break;
        case IntegrationType.customer:
            chunk = yield call(resolveCustomer, endpoint, config as any);
            break;
    }
    return chunk;
}

export function* initializeModel(endpoint: string, config: InitConfig) {
    const { events, ...modelChunk }: ModelChunk = yield call(resolveIntegrationType, endpoint, config);
    yield put({ type: TypeKeys.INITIALIZE_MODEL_COMPLETED, payload: modelChunk } as InitializeModelCompleted);
    yield put({ type: TypeKeys.EVENTS_INIT, payload: events } as SetEventsAction);
    return yield select((s: State) => ({ model: s.model, events: s.events }));
}
