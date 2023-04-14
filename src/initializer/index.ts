import 'url-polyfill';

import { domReady } from './dom-ready';
import { HtmlIntegration } from './html-integration';
import { PopupInitializer } from './popup-initializer';
import { environment, Configurator } from '../environment';

const init = (origin: string): Configurator => ({
    configure: (userConfig: any) => new PopupInitializer(origin, userConfig)
});

domReady().then((origin) => {
    const ValityCheckout = (environment.ValityCheckout = init(origin));
    const htmlIntegration = new HtmlIntegration(origin);
    if (htmlIntegration.isAvailable) {
        const userConfig = htmlIntegration.getUserConfig();
        const checkout = ValityCheckout.configure(userConfig);
        const payButton = htmlIntegration.renderPayButton(userConfig.label);
        payButton.onclick = (e: Event) => {
            e.preventDefault();
            checkout.open();
        };
    }
});
