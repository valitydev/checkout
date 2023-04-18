import * as React from 'react';
import { useEffect, useMemo } from 'react';

import { Overlay } from './overlay';
import { ModalContainer } from './modal-container';
import { LayoutLoader } from './layout-loader';
import { State } from 'checkout/state';
import { initializeApp } from 'checkout/actions';
import { ThemeProvider } from 'checkout/styled-components';
import { getTheme } from 'checkout/themes';
import { AppWrapper } from './app-wrapper';
import { GlobalStyle } from './global-style';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { getAppConfigSelector, getInitConfigSelector } from 'checkout/selectors';
import { InitialContext } from './initial-context';
import { Config } from 'checkout/config';

import { useInitializeApp } from './use-initialize-app';

export type AppProps = {
    config: Config;
};

export function App({ config }: AppProps) {
    const initState = useInitializeApp(config);

    const initConfig = useAppSelector(getInitConfigSelector);
    const appConfig = useAppSelector(getAppConfigSelector);
    const { initialized, error } = useAppSelector((s: State) => s.initializeApp);
    const theme = useMemo(() => getTheme(initConfig.theme || appConfig.fixedTheme), [initConfig, appConfig]);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initializeApp(initConfig));
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <>
                <GlobalStyle theme={theme} />
                <AppWrapper>
                    <Overlay />
                    {initState.status === 'SUCCESS' && (
                        <InitialContext.Provider value={initState.data}>
                            {initialized || error ? <ModalContainer /> : <LayoutLoader />}
                        </InitialContext.Provider>
                    )}
                </AppWrapper>
            </>
        </ThemeProvider>
    );
}
