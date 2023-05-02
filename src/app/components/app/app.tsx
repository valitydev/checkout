import * as React from 'react';

import { Overlay } from './overlay';
import { ModalContainer } from './modal-container';
import { LayoutLoader } from './layout-loader';
import { ThemeProvider } from 'checkout/styled-components';
import { AppWrapper } from './app-wrapper';
import { GlobalStyle } from './global-style';
import { InitialContext } from './initial-context';
import { useInitializeApp, useTheme } from 'checkout/hooks';
import { ModalError } from './modal-error';
import { InitParams } from 'checkout/initialize';

export type AppProps = {
    initParams: InitParams;
};

export function App({ initParams }: AppProps) {
    const theme = useTheme(initParams);
    const state = useInitializeApp(initParams);
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle theme={theme} />
            <AppWrapper>
                <Overlay />
                {state.status === 'INIT' && <LayoutLoader />}
                {state.status === 'SUCCESS' && (
                    <InitialContext.Provider value={state.data}>
                        <ModalContainer />
                    </InitialContext.Provider>
                )}
                {state.status === 'FAILURE' && <ModalError error={state.error} />}
            </AppWrapper>
        </ThemeProvider>
    );
}
