import { ModelState } from 'checkout/state';
import { TypeKeys, InvoiceCreated } from 'checkout/actions';

type ModelReducerAction = InvoiceCreated;

export function modelReducer(s: ModelState = null, action: ModelReducerAction): ModelState {
    switch (action.type) {
        case TypeKeys.INVOICE_CREATED:
            return {
                ...s,
                invoice: action.payload.invoice,
                invoiceAccessToken: action.payload.invoiceAccessToken
            };
    }
    return s;
}
