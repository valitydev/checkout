import { InvoiceChangeType, InvoiceEvent, ServiceProvider } from 'checkout/backend';
import { ModalState, PaymentMethod } from 'checkout/state';
import { PaymentMethodName } from 'checkout/config';
import { provideInteraction } from '../../provide-modal';
import { toModalResult } from './to-modal-result';
import { toInitialState } from './to-initial-state';
import { getLastChange } from 'checkout/utils';

export function initFromInvoiceEvents(
    events: InvoiceEvent[],
    methods: PaymentMethod[],
    initialPaymentMethod: PaymentMethodName,
    serviceProviders: ServiceProvider[]
): ModalState {
    const change = getLastChange(events);
    switch (change.changeType) {
        case InvoiceChangeType.PaymentInteractionRequested:
            return provideInteraction(events, serviceProviders);
        case InvoiceChangeType.PaymentStarted:
        case InvoiceChangeType.InvoiceStatusChanged:
        case InvoiceChangeType.PaymentStatusChanged:
            return toModalResult();
        case InvoiceChangeType.InvoiceCreated:
            return toInitialState(methods, initialPaymentMethod);
        default:
            throw { code: 'error.unsupported.invoice.change.type' };
    }
}
