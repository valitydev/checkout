import 'whatwg-fetch';
import Initialization from './backend-communication/Initialization';
import EventPoller from './backend-communication/EventPoller';
import Form from './elements/Form';
import Spinner from './elements/Spinner';
import Checkmark from './elements/Checkmark';
import ErrorPanel from './elements/ErrorPanel';
import Form3ds from './elements/Form3ds';
import TokenizerScript from './elements/TokenizerScript';
import RequestBuilder from './builders/RequestBuilder';
import settings from '../settings';
import domReady from '../utils/domReady';
import URITemplate from 'urijs/src/URITemplate';

domReady(function () {
    let params = {};

    window.addEventListener('message', (event) => {
        if (event && typeof event.data === 'object') {
            console.info('payform receive message: object, data:', event.data);
            params = event.data;
            if (params.logo) {
                form.setLogo(params.logo);
            }
            if (params.name) {
                form.setName(params.name);
            }
            if (params.buttonColor) {
                form.setPayButtonColor(params.buttonColor);
            }
            if (params.state && params.state === 'inProgress') {
                console.info('checked state inProgress, starts polling...');
                spinner.show();
                form.hide();
                polling();
            }
        }
    }, false);
    window.payformClose = () => window.parent.postMessage('payform-close', '*');

    new TokenizerScript();
    const spinner = new Spinner();
    const form = new Form();
    const checkmark = new Checkmark();
    const errorPanel = new ErrorPanel();

    const polling = () => {
        console.info('polling start');
        EventPoller.pollEvents(params.endpointEvents, params.invoiceId, settings.pollingTimeout, settings.pollingRetries).then(result => {
            console.info('polling resolve, data:', result);
            if (result.type === 'success') {
                console.info('polling result: success, post message: done');
                spinner.hide();
                checkmark.show();
                window.parent.postMessage('done', '*');
                setTimeout(() => window.parent.postMessage('payform-close', '*'), settings.closeFormTimeout);
            } else if (result.type === 'interact') {
                console.info('polling result: interact, post message: interact, starts 3ds interaction...');
                window.parent.postMessage('interact', '*');
                const redirectUrl = location.href;

                // const decodedTermUrl = decodeURIComponent(result.data.form[0].template);
                // const template = new URITemplate(decodedTermUrl);
                // const termUrlValue = template.expand({termination_uri: redirectUrl});
                // fetch(result.data.uriTemplate, {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/x-www-form-urlencoded'
                //     },
                //     body: `TermUrl=${termUrlValue}&PaReq=${result.data.form[1].template}&MD=${result.data.form[2].template}`
                // }).then(response => {
                //     if (response.status >= 200 && response.status < 300) {
                //         response.json().then(formHtml => {
                //             console.log(formHtml);
                //         });
                //     } else {
                //         console.error('ERROR');
                //     }
                // });

                const form3ds = new Form3ds(result.data, redirectUrl);
                form3ds.render();
                form3ds.submit();
            }
        }).catch(error => {
            console.error('polling error, data:', error);
            spinner.hide();
            if (error.type === 'error') {
                errorPanel.show(`Error:\n${error.data.eventType}\nStatus: ${error.data.status}`);
            } else if (error.type === 'long polling') {
                errorPanel.show('Too long polling');
            } else {
                errorPanel.show('Unknown error');
            }
        });
    };

    const onTokenCreate = paymentTools => {
        console.info('tokenization done, data:', paymentTools);
        const initRequest = RequestBuilder.buildInitRequest(params.invoiceId, paymentTools, form.getEmail());
        console.info('request to initialization endpoint start, data:', initRequest);
        Initialization.sendInit(params.endpointInit, initRequest).then(() => {
            console.info('request to initialization endpoint done');
            polling();
        });
    };

    window.pay = () => {
        if (window.Tokenizer === undefined) {
            form.hide();
            errorPanel.show('Tokenizer.js is not available');
            return false;
        }
        if (form.isValid()) {
            console.info('pay start');
            spinner.show();
            form.hide();
            window.Tokenizer.setPublicKey(params.key);
            const request = RequestBuilder.buildTokenizationRequest(
                form.getCardHolder(),
                form.getCardNumber(),
                form.getExpDate(),
                form.getCvv()
            );
            console.info('tokenization start, data:', request);
            window.Tokenizer.card.createToken(request, onTokenCreate, error => {
                spinner.hide();
                errorPanel.show(`Error create token:\n${error.message}`);
            });
        } else {
            console.warn('form is invalid');
        }
    };
});
