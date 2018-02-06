import * as ReactDOM from 'react-dom';
import { Transport, PossibleEvents } from '../communication-ts';
import { State } from './state';
import { ResultState } from 'checkout/state';
import { isSafetyUrl } from 'checkout/utils';

class AppFinalizer {

    constructor(private transport: Transport, private checkoutEl: HTMLElement) {
    }

    close() {
        ReactDOM.unmountComponentAtNode(this.checkoutEl);
        this.transport.emit(PossibleEvents.close);
        this.transport.destroy();
    }

    done(redirectUrl: string, popupMode: boolean) {
        setTimeout(() => {
            ReactDOM.unmountComponentAtNode(this.checkoutEl);
            this.transport.emit(PossibleEvents.done);
            this.transport.destroy();
            if (popupMode) {
                redirectUrl && isSafetyUrl(redirectUrl) ? location.replace(redirectUrl) : window.close();
            }
        }, 4000);
    }
}

export function finalize(state: State, transport: Transport, checkoutEl: HTMLElement) {
    const finalizer = new AppFinalizer(transport, checkoutEl);
    switch (state.result) {
        case ResultState.close:
            finalizer.close();
            break;
        case ResultState.done:
            const initConfig = state.config.initConfig;
            finalizer.done(initConfig.redirectUrl, initConfig.popupMode);
            break;
    }
}