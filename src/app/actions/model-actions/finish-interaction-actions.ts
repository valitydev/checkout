import { AbstractAction, TypeKeys } from 'checkout/actions';
import { LogicError, ServiceProvider } from 'checkout/backend';

export interface FinishInteractionRequested extends AbstractAction<FinishInteractionPayload> {
    type: TypeKeys.FINISH_INTERACTION_REQUESTED;
    payload: FinishInteractionPayload;
}

export interface FinishInteractionCompleted extends AbstractAction {
    type: TypeKeys.FINISH_INTERACTION_COMPLETED;
}

export interface FinishInteractionFailed extends AbstractAction<LogicError> {
    type: TypeKeys.FINISH_INTERACTION_FAILED;
    payload: LogicError;
}

export type FinishInteractionPayload = {
    capiEndpoint: string;
    invoiceID: string;
    invoiceAccessToken: string;
    serviceProviders: ServiceProvider[];
};

export const finishInteraction = (
    capiEndpoint: string,
    invoiceID: string,
    invoiceAccessToken: string,
    serviceProviders: ServiceProvider[]
) => ({
    type: TypeKeys.FINISH_INTERACTION_REQUESTED,
    payload: {
        capiEndpoint,
        invoiceID,
        invoiceAccessToken,
        serviceProviders
    }
});
