import { lazy, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';

import { useInitApp, useTheme } from 'checkout/hooks';
import { InitParams } from 'checkout/initialize';

import { AppWrapper } from './app-wrapper';
import { GlobalStyle } from './global-style';
import { InitialContext } from './initial-context';
import { LayoutLoader } from './layout-loader';
import { ModalError } from './modal-error';
import { Overlay } from './overlay';
import { ResultContext } from './result-context';

const ModalContainer = lazy(() => import('./modal-container/modal-container'));

export type AppProps = {
    initParams: InitParams;
    onComplete: () => void;
};

export function App({ initParams, onComplete }: AppProps) {
    const theme = useTheme(initParams);
    const { state, init } = useInitApp();
    const [isComplete, setIsComplete] = useState(null);

    useEffect(() => init(initParams), [initParams]);

    useEffect(() => {
        if (isComplete) {
            onComplete();
        }
    }, [isComplete]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle theme={theme} />
            <AppWrapper>
                <Overlay />
                {state.status === 'PRISTINE' && <LayoutLoader />}
                {state.status === 'SUCCESS' && (
                    <InitialContext.Provider value={state.data}>
                        <ResultContext.Provider value={{ setIsComplete }}>
                            <ModalContainer />
                        </ResultContext.Provider>
                    </InitialContext.Provider>
                )}
                {state.status === 'FAILURE' && <ModalError error={state.error} />}
            </AppWrapper>
        </ThemeProvider>
    );
}
