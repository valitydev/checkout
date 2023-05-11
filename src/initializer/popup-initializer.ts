import { initialize } from 'cross-origin-communicator';

import { Initializer } from './initializer';
import { CommunicatorEvents, communicatorInstanceName } from '../communicator-constants';
import { InitConfig } from '../app/config';
import { serializeUrlParams } from '../serialize-url-params';

export class PopupInitializer extends Initializer {
    open(openConfig: InitConfig = {}) {
        const url = `${this.origin}/v1/checkout.html?${serializeUrlParams({ ...this.config, ...openConfig })}`;
        const target = window.open(url, '_blank');
        initialize(target, this.origin, communicatorInstanceName).then((transport) => {
            this.opened();
            transport.on(CommunicatorEvents.finished, () => {
                transport.destroy();
                this.finished();
            });
            transport.on(CommunicatorEvents.close, () => {
                transport.destroy();
                this.close();
            });
        });
    }

    close() {
        this.closed();
    }
}
