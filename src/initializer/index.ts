import { domReady } from './dom-ready';
import { environment, Configurator } from './environment';
import { PopupInitializer } from './popup-initializer';

const init = (origin: string): Configurator => ({
    configure: (userConfig: any) => new PopupInitializer(origin, userConfig),
});

domReady().then((origin) => {
    environment.ValityCheckout = init(origin);
});
