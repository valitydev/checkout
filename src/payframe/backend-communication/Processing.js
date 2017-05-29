import Tokenization from './Tokenization';
import PaymentCreator from './PaymentCreator';
import EventPoller from './EventPoller';

class Processing {

    static process(params) {
        const tokenization = new Tokenization(params.tokenizer);
        tokenization.setAccessToken(params.invoiceAccessToken);
        return tokenization.createToken(params.cardHolder, params.cardNumber, params.cardExpire, params.cardCvv).then(paymentTools => {
            return PaymentCreator.create(params.capiEndpoint, params.invoiceID, params.invoiceAccessToken, paymentTools, params.email).then(() => {
                return EventPoller.pollEvents(params.capiEndpoint, params.invoiceID, params.invoiceAccessToken);
            });
        });
    }

    static pollEvents(params) {
        return new Promise((resolve, reject) => {
            EventPoller.pollEvents(params.capiEndpoint, params.invoiceID, params.invoiceAccessToken).then(result => {
                resolve(result);
            }).catch(error => reject(error));
        })
    }
}

export default Processing;