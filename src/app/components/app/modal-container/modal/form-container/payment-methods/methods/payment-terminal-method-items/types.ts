import { PaymentRequestedPayload } from 'checkout/actions';
import { FormInfo } from 'checkout/state';

export type SetFormInfoAction = (formInfo: FormInfo) => any;
export type PayAction = (payload: PaymentRequestedPayload) => any;
