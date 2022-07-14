import { put, PutEffect, select, SelectEffect } from 'redux-saga/effects';
import { PaymentMethod, EventsState, State } from 'checkout/state';
import { InitializeModalCompleted, TypeKeys } from 'checkout/actions';
import { InitConfig, IntegrationType } from 'checkout/config';
import { toInitialState } from './to-initial-state';
import { initFromInvoiceEvents } from './init-from-invoice-events';

type Effects = SelectEffect | PutEffect<InitializeModalCompleted>;

export function* initializeModal(
    initConfig: InitConfig,
    events: EventsState,
    methods: PaymentMethod[]
): Iterator<Effects> {
    let initializedModals;
    const { integrationType, initialPaymentMethod } = initConfig;
    switch (integrationType) {
        case IntegrationType.invoiceTemplate:
            initializedModals = toInitialState(methods, initialPaymentMethod);
            break;
        case IntegrationType.invoice:
            const serviceProviders = yield select((s: State) => s.model?.serviceProviders);
            initializedModals = initFromInvoiceEvents(events.events, methods, initialPaymentMethod, serviceProviders);
            break;
        default:
            throw { code: 'error.unsupported.integration.type' };
    }
    yield put({
        type: TypeKeys.INITIALIZE_MODAL_COMPLETED,
        payload: initializedModals
    } as InitializeModalCompleted);
}
