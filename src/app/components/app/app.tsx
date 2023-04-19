import * as React from 'react';
import { useEffect } from 'react';

import { Overlay } from './overlay';
import { ModalContainer } from './modal-container';
import { LayoutLoader } from './layout-loader';
import { State } from 'checkout/state';
import { initializeApp } from 'checkout/actions';
import { ThemeProvider } from 'checkout/styled-components';
import { AppWrapper } from './app-wrapper';
import { GlobalStyle } from './global-style';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
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

    const { initialized, error } = useAppSelector((s: State) => s.initializeApp);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initializeApp(initConfig));
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle theme={theme} />
            <AppWrapper>
                <Overlay />
                {state.status === 'SUCCESS' && (
                    <InitialContext.Provider value={state.data}>
                        {initialized || error ? <ModalContainer /> : <LayoutLoader />}
                    </InitialContext.Provider>
                )}
                {state.status === 'LOADING' && <LayoutLoader />}
            </AppWrapper>
        </ThemeProvider>
    );
}
