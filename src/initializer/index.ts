import { domReady } from './dom-ready';
import { PopupInitializer } from './popup-initializer';
import { environment, Configurator } from '../environment';

const init = (origin: string): Configurator => ({
    configure: (userConfig: any) => new PopupInitializer(origin, userConfig),
});

domReady().then((origin) => {
    environment.ValityCheckout = init(origin);
});
