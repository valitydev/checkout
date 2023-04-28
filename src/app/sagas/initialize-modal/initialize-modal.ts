import { ForkEffect, put, PutEffect, SelectEffect, takeLatest } from 'redux-saga/effects';
import { InitializeModalCompleted, InitializeModalRequested, TypeKeys } from 'checkout/actions';
import { IntegrationType } from 'checkout/config';
import { toInitialState } from './to-initial-state';
import { initFromInvoiceEvents } from './init-from-invoice-events';

type Effects = SelectEffect | PutEffect<InitializeModalCompleted>;

export function* initializeModal({
    payload: { initConfig, events, availablePaymentMethods, serviceProviders }
}: InitializeModalRequested): Iterator<Effects> {
    let initializedModals;
    const { integrationType, initialPaymentMethod, skipUserInteraction } = initConfig;
    switch (integrationType) {
        case IntegrationType.invoiceTemplate:
            initializedModals = toInitialState(availablePaymentMethods, initialPaymentMethod);
            break;
        case IntegrationType.invoice:
            initializedModals = initFromInvoiceEvents(
                events,
                availablePaymentMethods,
                initialPaymentMethod,
                serviceProviders,
                skipUserInteraction
            );
            break;
        default:
            throw { code: 'error.unsupported.integration.type' };
    }
    yield put({
        type: TypeKeys.INITIALIZE_MODAL_COMPLETED,
        payload: initializedModals
    } as InitializeModalCompleted);
}

export function* watchInitializeModal(): Iterator<ForkEffect> {
    yield takeLatest(TypeKeys.INITIALIZE_MODAL_REQUESTED, initializeModal);
}
