import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Transport } from 'cross-origin-communicator';

import { setResult } from 'checkout/actions';
import { configureStore } from './configure-store';
import { App } from './components/app';
import { finalize } from './finalize';
import { initialize } from './initialize';

import './styles/font-face.css';
import { getAppConfig } from './backend';

Promise.all([initialize(), getAppConfig()]).then(([[transport, config], appConfig]) => {
    const app = document.getElementById('app');
    const store = configureStore({ config });
    const initConfig = config.initConfig;
    store.subscribe(() => {
        const state = store.getState();
        if (state.result) {
            finalize(
                state,
                transport as Transport,
                app,
                bindActionCreators(setResult, store.dispatch),
                initConfig.redirectUrl
            );
        }
    });
    ReactDOM.render(
        <Provider store={store}>
            <App initConfig={initConfig} appConfig={appConfig} />
        </Provider>,
        app
    );
});
