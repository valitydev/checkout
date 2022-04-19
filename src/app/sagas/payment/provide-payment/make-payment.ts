import { call, put } from 'redux-saga/effects';
import { AmountInfoState, ModelState, PayableFormValues } from 'checkout/state';
import { getPayableInvoice } from './get-payable-invoice';
import { LogicErrorCode, PaymentResource } from 'checkout/backend';
import { Config } from 'checkout/config';
import { createPayment } from './create-payment';
import { pollInvoiceEvents } from '../../poll-events';
import { TypeKeys } from 'checkout/actions';
import { SetAcceptedError } from 'checkout/actions/error-actions/set-accepted-error';
import { serializeUrlParams } from '../../../../serialize-url-params';

type CreatePaymentResourceFn = (invoiceAccessToken: any) => Iterator<PaymentResource>;

const prepareRedirectUrl = (origin: string, invoiceID: string, invoiceAccessToken: string, configRedirectUrl: string) =>
    `${origin}/v1/checkout.html?${serializeUrlParams({
        invoiceID,
        invoiceAccessToken,
        configRedirectUrl
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
    const { capiEndpoint } = appConfig;
    const {
        invoice: { id },
        invoiceAccessToken
    } = yield call(getPayableInvoice, initConfig, capiEndpoint, model, amountInfo, values.amount);
    const paymentResource = yield call(fn, invoiceAccessToken);
    let redirectUrl;
    if (setRedirect) {
        redirectUrl = prepareRedirectUrl(origin, id, invoiceAccessToken, initConfig.redirectUrl);
    }
    try {
        yield call(
            createPayment,
            capiEndpoint,
            invoiceAccessToken,
            id,
            values.email,
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
