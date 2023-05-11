import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setResult } from 'checkout/actions';
import { configureStore } from './configure-store';
import { App } from './components/app';
import { finalize } from './finalize';
import { initialize } from './initialize';

import './styles/font-face.css';

initialize().then(([transport, initParams]) => {
    const app = document.getElementById('app');
    const store = configureStore();
    store.subscribe(() => {
        const state = store.getState();
        if (state.result) {
            finalize(
                state,
                transport,
                app,
                bindActionCreators(setResult, store.dispatch),
                initParams.initConfig.redirectUrl
            );
        }
    });
    ReactDOM.render(
        <Provider store={store}>
            <App initParams={initParams} />
        </Provider>,
        app
    );
});
