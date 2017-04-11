import './app.scss';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import StyleLink from './elements/StyleLink';
import ready from '../utils/domReady';
import Listener from '../communication/Listener';
import Utils from '../utils/Utils';
import Modal from './components/Modal';
import StateWorker from './state/StateWorker';
import ParentCommunicator from '../communication/ParentCommunicator';
import ConfigLoader from './loaders/ConfigLoader';
import Invoice from './backend-communication/Invoice';
import isMobile from 'ismobilejs';

ready(function () {
    const styleLink = new StyleLink();
    styleLink.render();

    function renderModal(data, isResumed) {
        if (Utils.isSafari()) {
            styleLink.rerender();
        }

        ConfigLoader.load(data.payformHost).then((config) => {
            Invoice.getInvoice(config.capiEndpoint, data.invoiceID, data.invoiceAccessToken)
                .then((response) => {

                    Object.assign(data, {
                        currency: response.currency,
                        amount:  String(Number(response.amount) / 100)
                    });

                    const root = document.getElementById('root');

                    ReactDOM.render(
                        <Modal invoiceAccessToken={data.invoiceAccessToken}
                               capiEndpoint={config.capiEndpoint}
                               tokenizerEndpoint={config.tokenizerEndpoint}
                               endpointInit={data.endpointInit}
                               endpointEvents={data.endpointEvents}
                               invoiceID={data.invoiceID}
                               orderId={data.orderId}
                               logo={data.logo}
                               amount={data.amount}
                               currency={data.currency}
                               buttonColor={data.buttonColor}
                               name={data.name}
                               payformHost={data.payformHost}
                               isResume={isResumed}
                        />,
                        root
                    );
                },
                error => console.error(error));
        });
    }

    function checkPayformState() {
        if (isMobile.any) {
            const search = location.search.substring(1);
            if (search.length > 1) {
                const params = search.length > 1 ? JSON.parse(`{"${decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"')}"}`) : undefined;
                renderModal(params, false);
            }
        } else {
            const payFormData = StateWorker.loadState();
            if (payFormData) {
                if (StateWorker.is3DSInProgress(payFormData.invoiceID)) {
                    ParentCommunicator.send({type: 'finish3ds', invoiceID: payFormData.invoiceID});
                    renderModal(payFormData, true);
                } else {
                    StateWorker.flush();
                }
            }
        }
    }

    window.addEventListener('message', (message) => {
        switch (message.data.type) {
            case 'finish3ds': {
                const payFormData = StateWorker.loadState();
                if (payFormData) {
                    if (StateWorker.is3DSInProgress(payFormData.invoiceID)) {
                        ParentCommunicator.send({type: 'finish3ds', invoiceID: payFormData.invoiceID});
                        renderModal(payFormData, true);
                    } else {
                        StateWorker.flush();
                    }
                }
                break;
            }
        }
    });

    Listener.addListener(message => {
        switch (message.type) {
            case 'init-payform':
                StateWorker.saveState(message.data);
                renderModal(message.data, false);
                break;
            case 'unload':
                StateWorker.flush();
                break;
        }
    });

    checkPayformState();
});
