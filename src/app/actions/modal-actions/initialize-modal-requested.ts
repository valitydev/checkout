import { AbstractAction, TypeKeys } from 'checkout/actions';
import { InitConfig } from 'checkout/config';
import { Event, ServiceProvider } from 'checkout/backend';
import { PaymentMethod } from 'checkout/hooks/init-available-payment-methods';

export type InitializeModalRequestedPayload = {
    initConfig: InitConfig;
    events: Event[];
    availablePaymentMethods: PaymentMethod[];
    serviceProviders: ServiceProvider[];
};

export interface InitializeModalRequested extends AbstractAction<InitializeModalRequestedPayload> {
    type: TypeKeys.INITIALIZE_MODAL_REQUESTED;
    payload: InitializeModalRequestedPayload;
}

export const initializeModal = (
    initConfig: InitConfig,
    events: Event[],
    availablePaymentMethods: PaymentMethod[],
    serviceProviders: ServiceProvider[]
): InitializeModalRequested => ({
    type: TypeKeys.INITIALIZE_MODAL_REQUESTED,
    payload: {
        initConfig,
        events,
        availablePaymentMethods,
        serviceProviders
    }
});
