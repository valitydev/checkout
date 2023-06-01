import { InvoiceChangeType, InvoiceEvent, ServiceProvider } from 'checkout/backend';
import { ModalState } from 'checkout/state';
import { provideInteraction } from '../provide-modal';
import { toModalResult } from './to-modal-result';
import { toInitialState } from './to-initial-state';
import { getLastChange } from 'checkout/utils';
import { PaymentMethod } from 'checkout/hooks';

export function initFromInvoiceEvents(
    events: InvoiceEvent[],
    methods: PaymentMethod[],
    serviceProviders: ServiceProvider[],
    skipUserInteraction: boolean
): ModalState {
    const change = getLastChange(events);
    switch (change.changeType) {
        case InvoiceChangeType.PaymentInteractionRequested:
            return skipUserInteraction ? toModalResult(change) : provideInteraction(events, serviceProviders);
        case InvoiceChangeType.PaymentStarted:
        case InvoiceChangeType.InvoiceStatusChanged:
        case InvoiceChangeType.PaymentStatusChanged:
            return toModalResult(change);
        case InvoiceChangeType.InvoiceCreated:
            return toInitialState(methods);
        default:
            throw { code: 'error.unsupported.invoice.change.type' };
    }
}
