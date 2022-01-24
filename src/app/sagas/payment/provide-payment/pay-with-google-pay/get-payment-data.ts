import { call, CallEffect } from 'redux-saga/effects';
import { logPrefix } from 'checkout/log-messages';
import { AmountInfoState } from 'checkout/state';
import { toDisplayAmount } from 'checkout/utils';
import { AppConfig } from 'checkout/backend';

const getPaymentDataRequest = (
    config: AppConfig['googlePay'],
    amountInfo: AmountInfoState,
    formAmount: string
): PaymentDataRequest => ({
    merchantId: config.merchantID,
    merchantInfo: {
        merchantName: config.merchantName,
        merchantOrigin: config.merchantOrigin
    },
    paymentMethodTokenizationParameters: {
        tokenizationType: 'PAYMENT_GATEWAY',
        parameters: {
            gateway: config.gateway,
            gatewayMerchantId: config.merchantID
        }
    },
    allowedPaymentMethods: ['CARD', 'TOKENIZED_CARD'],
    cardRequirements: {
        allowedCardNetworks: ['MASTERCARD', 'VISA']
    },
    transactionInfo: {
        currencyCode: amountInfo.currencyCode,
        totalPriceStatus: 'FINAL',
        totalPrice: toDisplayAmount(amountInfo, formAmount)
    }
});

const loadPaymentData = (
    client: google.payments.api.PaymentsClient,
    request: PaymentDataRequest
): Promise<PaymentData> => client.loadPaymentData(request);

const handleLoadPaymentDataError = (e: PaymentsError) => {
    if (e && e.statusCode) {
        switch (e.statusCode) {
            case 'CANCELED':
                throw { code: 'error.google.pay.cancel' };
            case 'DEVELOPER_ERROR':
                throw { message: e.statusMessage };
            default:
                console.error(`${logPrefix} Unhandled PaymentsClient statusCode`, e);
                throw { code: 'error.google.pay.unknown' };
        }
    }
    console.error(`${logPrefix} Unknown PaymentsClient error`, e);
    throw { code: 'error.google.pay.unknown' };
};

export function* getPaymentData(
    googlePayConfig: AppConfig['googlePay'],
    amountInfo: AmountInfoState,
    formAmount: string
): Iterator<CallEffect | PaymentData> {
    try {
        const paymentClient = new google.payments.api.PaymentsClient({ environment: 'PRODUCTION' });
        const request = getPaymentDataRequest(googlePayConfig, amountInfo, formAmount);
        return yield call(loadPaymentData, paymentClient, request);
    } catch (e) {
        yield call(handleLoadPaymentDataError, e);
    }
}
