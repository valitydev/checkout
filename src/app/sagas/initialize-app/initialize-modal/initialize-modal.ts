import { ForkEffect, put, PutEffect, select, SelectEffect, takeLatest } from 'redux-saga/effects';
import { State } from 'checkout/state';
import { InitializeModalCompleted, InitializeModalRequested, TypeKeys } from 'checkout/actions';
import { IntegrationType } from 'checkout/config';
import { toInitialState } from './to-initial-state';
import { initFromInvoiceEvents } from './init-from-invoice-events';

type Effects = SelectEffect | PutEffect<InitializeModalCompleted>;

export function* initializeModal({
    payload: { initConfig, events, availablePaymentMethods }
}: InitializeModalRequested): Iterator<Effects> {
    let initializedModals;
    const { integrationType, initialPaymentMethod } = initConfig;
    switch (integrationType) {
        case IntegrationType.invoiceTemplate:
            initializedModals = toInitialState(availablePaymentMethods, initialPaymentMethod);
            break;
        case IntegrationType.invoice:
            const serviceProviders = yield select((s: State) => s.model?.serviceProviders);
            initializedModals = initFromInvoiceEvents(
                events,
                availablePaymentMethods,
                initialPaymentMethod,
                serviceProviders,
                initConfig.skipUserInteraction
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
