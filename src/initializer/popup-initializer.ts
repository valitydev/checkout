import { Initializer } from './initializer';
import { serializeUrlParams } from './serialize-url-params';
import { InitConfig } from '../common/init';
import { initialize, CommunicatorEvents, communicatorInstanceName } from '../communicator';

export class PopupInitializer extends Initializer {
    open(openConfig: InitConfig = {}) {
        const url = `${this.origin}/v1/checkout.html?${serializeUrlParams({
            ...this.config,
            ...openConfig,
        })}`;
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
