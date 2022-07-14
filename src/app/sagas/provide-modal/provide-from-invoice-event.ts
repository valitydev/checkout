import { put, PutEffect, select, SelectEffect } from 'redux-saga/effects';
import { InvoiceEvent, InvoiceChangeType, ServiceProvider } from 'checkout/backend';
import { Direction, GoToFormInfo, TypeKeys, SetModalState } from 'checkout/actions';
import { ResultFormInfo, ResultType, State } from 'checkout/state';
import { provideInteraction } from './provide-interaction';
import { getLastChange } from 'checkout/utils';

type SetStateFromEvents = GoToFormInfo | SetModalState;

function toPayload(events: InvoiceEvent[], serviceProviders: ServiceProvider[]): SetStateFromEvents {
    const change = getLastChange(events);
    switch (change.changeType) {
        case InvoiceChangeType.PaymentStatusChanged:
        case InvoiceChangeType.InvoiceStatusChanged:
            return {
                type: TypeKeys.GO_TO_FORM_INFO,
                payload: {
                    formInfo: new ResultFormInfo(ResultType.processed),
                    direction: Direction.forward
                }
            };
        case InvoiceChangeType.PaymentInteractionRequested:
            return {
                type: TypeKeys.SET_MODAL_STATE,
                payload: provideInteraction(events, serviceProviders)
            };
        default:
            throw { code: 'error.unsupported.invoice.change.type' };
    }
}

export function* provideFromInvoiceEvent(
    events: InvoiceEvent[]
): IterableIterator<SelectEffect | PutEffect<SetStateFromEvents>> {
    const serviceProviders = yield select((s: State) => s.model?.serviceProviders);
    return yield put<SetStateFromEvents>(toPayload(events, serviceProviders));
}
