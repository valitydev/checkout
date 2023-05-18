import { call, put } from 'redux-saga/effects';
import { PayableFormValues } from 'checkout/state';
import { LogicErrorCode, PaymentResource } from 'checkout/backend';
import { createPayment } from './create-payment';
import { pollInvoiceEvents } from '../../poll-events';
import { AppContext, TypeKeys } from 'checkout/actions';
import { SetAcceptedError } from 'checkout/actions/error-actions/set-accepted-error';

type CreatePaymentResourceFn = (invoiceAccessToken: any) => Iterator<PaymentResource>;

type CreateRedirectUrlFn = (
    invoiceID: string,
    invoiceAccessToken: string,
    invoiceDueDate: string
) => Promise<string | null>;

export function* makePayment(
    context: AppContext,
    values: PayableFormValues,
    fn: CreatePaymentResourceFn,
    createRedirectUrlFn: CreateRedirectUrlFn = null
) {
    const {
        initConfig,
        appConfig,
        payableInvoice: {
            invoiceAccessToken,
            invoice: { id, dueDate, externalID }
        }
    } = context;
    const { capiEndpoint } = appConfig;
    const paymentResource = yield call(fn, invoiceAccessToken);
    let redirectUrl;
    if (createRedirectUrlFn) {
        redirectUrl = yield call(createRedirectUrlFn, id, invoiceAccessToken, dueDate);
    }
    try {
        yield call(
            createPayment,
            capiEndpoint,
            invoiceAccessToken,
            { invoiceID: id, externalID },
            values,
            paymentResource,
            initConfig,
            redirectUrl
        );
    } catch (e) {
        switch (e.code) {
            case LogicErrorCode.invalidInvoiceStatus:
            case LogicErrorCode.invoicePaymentPending:
                yield put<SetAcceptedError>({ type: TypeKeys.SET_ACCEPTED_ERROR, payload: e });
                break;
            default:
                throw e;
        }
    }
    yield call(pollInvoiceEvents, capiEndpoint, invoiceAccessToken, id);
}
