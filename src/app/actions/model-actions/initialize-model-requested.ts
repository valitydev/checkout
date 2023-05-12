import { Invoice } from 'checkout/backend';
import { TypeKeys } from '../type-keys';

export interface InitializeModelRequestedPayload {
    invoice: Invoice;
    invoiceAccessToken: string;
}

export const initializeModel = (payload: InitializeModelRequestedPayload) => ({
    type: TypeKeys.INITIALIZE_MODEL_REQUESTED,
    payload
});
