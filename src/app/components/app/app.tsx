import * as React from 'react';

import { Overlay } from './overlay';
import { ModalContainer } from './modal-container';
import { LayoutLoader } from './layout-loader';
import { ThemeProvider } from 'checkout/styled-components';
import { AppWrapper } from './app-wrapper';
import { GlobalStyle } from './global-style';
import { InitialContext } from './initial-context';
import { InitConfig } from 'checkout/config';
import { AppConfig } from 'checkout/backend';
import { useInitializeApp, useTheme } from 'checkout/hooks';

export type AppProps = {
    initConfig: InitConfig;
    appConfig: AppConfig;
};

export function App({ initConfig, appConfig }: AppProps) {
    const theme = useTheme(appConfig.fixedTheme, initConfig.theme);
    const state = useInitializeApp({ initConfig, appConfig });

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle theme={theme} />
            <AppWrapper>
                <Overlay />
                {state.status === 'SUCCESS' && (
                    <InitialContext.Provider value={state.data}>
                        <ModalContainer />
                    </InitialContext.Provider>
                )}
                {state.status === 'LOADING' && <LayoutLoader />}
            </AppWrapper>
        </ThemeProvider>
    );
}
