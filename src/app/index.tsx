import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './components/app';
import { initialize } from './initialize';
import { CommunicatorEvents } from '../communicator';
import isNil from './utils/is-nil';

const ON_COMPLETE_TIMEOUT_MS = 1000 * 5;

initialize().then(([transport, initParams]) => {
    const container = document.getElementById('app');
    const root = createRoot(container);
    root.render(
        <App
            initParams={initParams}
            onComplete={() => {
                setTimeout(() => {
                    transport.emit(CommunicatorEvents.finished);
                    transport.destroy();
                    const redirectUrl = initParams.initConfig.redirectUrl;
                    if (!isNil(redirectUrl)) {
                        window.open(redirectUrl, '_self');
                    }
                    root.unmount();
                }, ON_COMPLETE_TIMEOUT_MS);
            }}
        />,
    );
});
