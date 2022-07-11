import { call, put } from 'redux-saga/effects';
import { AmountInfoState, ModelState, PayableFormValues } from 'checkout/state';
import { getPayableInvoice } from './get-payable-invoice';
import { LogicErrorCode, PaymentResource, shortenUrl } from 'checkout/backend';
import { Config } from 'checkout/config';
import { createPayment } from './create-payment';
import { pollInvoiceEvents } from '../../poll-events';
import { TypeKeys } from 'checkout/actions';
import { SetAcceptedError } from 'checkout/actions/error-actions/set-accepted-error';
import { serializeUrlParams } from '../../../../serialize-url-params';

type CreatePaymentResourceFn = (invoiceAccessToken: any) => Iterator<PaymentResource>;

const prepareRedirectUrl = (origin: string, invoiceID: string, invoiceAccessToken: string, redirectUrl: string) =>
    `${origin}/v1/checkout.html?${serializeUrlParams({
        invoiceID,
        invoiceAccessToken,
        redirectUrl
    })}`;

export function* makePayment(
    config: Config,
    model: ModelState,
    values: PayableFormValues,
    amountInfo: AmountInfoState,
    fn: CreatePaymentResourceFn,
    setRedirect = false
) {
    const { initConfig, appConfig, origin } = config;
    const { capiEndpoint, urlShortenerEndpoint } = appConfig;
    const {
        invoice: { id, dueDate },
        invoiceAccessToken
    } = yield call(getPayableInvoice, initConfig, capiEndpoint, model, amountInfo, values.amount);
    const paymentResource = yield call(fn, invoiceAccessToken);
    let shortenedRedirectUrl;
    if (setRedirect) {
        const redirectUrl = prepareRedirectUrl(origin, id, invoiceAccessToken, initConfig.redirectUrl);
        const { shortenedUrl } = yield call(shortenUrl, urlShortenerEndpoint, invoiceAccessToken, {
            sourceUrl: redirectUrl,
            expiresAt: dueDate
        });
        shortenedRedirectUrl = shortenedUrl;
    }
    try {
        yield call(
            createPayment,
            capiEndpoint,
            invoiceAccessToken,
            id,
            values,
            paymentResource,
            initConfig,
            shortenedRedirectUrl
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
