import { AbstractAction, TypeKeys } from 'checkout/actions';
import { InitConfig } from 'checkout/config';
import { PaymentMethod } from 'checkout/state';
import { Event } from 'checkout/backend';

export type InitializeModalRequestedPayload = {
    initConfig: InitConfig;
    events: Event[];
    availablePaymentMethods: PaymentMethod[];
};

export interface InitializeModalRequested extends AbstractAction<InitializeModalRequestedPayload> {
    type: TypeKeys.INITIALIZE_MODAL_REQUESTED;
    payload: InitializeModalRequestedPayload;
}

export const initializeModal = (
    initConfig: InitConfig,
    events: Event[],
    availablePaymentMethods: PaymentMethod[]
): InitializeModalRequested => ({
    type: TypeKeys.INITIALIZE_MODAL_REQUESTED,
    payload: {
        initConfig,
        events,
        availablePaymentMethods
    }
});
