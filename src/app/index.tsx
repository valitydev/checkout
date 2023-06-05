import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore } from './configure-store';
import { App } from './components/app';
import { initialize } from './initialize';
import { CommunicatorEvents } from '../communicator';
import isNil from './utils/is-nil';

const ON_COMPLETE_TIMEOUT_MS = 1000 * 5;

initialize().then(([transport, initParams]) => {
    const app = document.getElementById('app');
    const store = configureStore();
    ReactDOM.render(
        <Provider store={store}>
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
                        ReactDOM.unmountComponentAtNode(app);
                    }, ON_COMPLETE_TIMEOUT_MS);
                }}
            />
        </Provider>,
        app
    );
});
