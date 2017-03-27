import './payframe.scss';
import Iframe from './elements/Iframe';
import PayButton from './elements/PayButton';
import StyleLink from './elements/StyleLink';
import InitScript from './elements/InitScript';
import Utils from '../utils/Utils';
import Listener from '../communication/Listener';
import CheckoutCommunicator from '../communication/CheckoutCommunicator';
import ready from '../utils/domReady';
import processingCallback from './callbacks/processingCallback';

ready(function () {
    const RbkmoneyCheckout = {
        config: {}
    };

    const initScript = new InitScript();
    const payformHost = initScript.getHost();
    const styles = new StyleLink(payformHost);
    const iframe = new Iframe(payformHost);
    const communicator = new CheckoutCommunicator(iframe.getName(), iframe.getSrc());
    const params = initScript.getParams();
    const payButton = new PayButton('Pay with RBKmoney');

    Object.assign(params, {
        locationHost: Utils.getOriginUrl(location.href),
        payformHost: payformHost
    });

    Listener.addListener(message => {
        switch (message.type) {
            case 'close':
                close();
                break;
            case 'done':
                close();
                processingCallback(params.endpointSuccess, params.endpointSuccessMethod);
                break;
            case 'error':
                close();
                processingCallback(params.endpointFailed, params.endpointFailedMethod);
                break;
            case 'start3ds':
                iframe.enable3DS();
                break;
            case 'finish3ds':
                iframe.disable3DS();
                break;
        }
    });

    window.addEventListener('beforeunload', () => {
        communicator.send({type: 'unload'});
    });

    function open() {
        communicator.send({
            type: 'init-payform',
            data: params
        });
        iframe.show();

        RbkmoneyCheckout.config.opened ? RbkmoneyCheckout.config.opened() : false;
    }

    function close() {
        iframe.hide();
        iframe.destroy();
        iframe.render();

        RbkmoneyCheckout.config.closed ? RbkmoneyCheckout.config.closed() : false;
    }
    
    RbkmoneyCheckout.open = () => open();
    RbkmoneyCheckout.close = () => close();

    RbkmoneyCheckout.configure = (config) => {
        RbkmoneyCheckout.config = Object.assign(params, config);
    };

    payButton.onclick = open;

    payButton.render();
    styles.render();
    iframe.render();

    window.RbkmoneyCheckout = RbkmoneyCheckout;
});
