import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

import { AppWrapper } from 'checkout/components/app/app-wrapper';
import { GlobalStyle } from 'checkout/components/app/global-style';
import { LayoutLoader } from 'checkout/components/app/layout-loader';
import { Overlay } from 'checkout/components/app/overlay';
import { InitParams } from 'checkout/initialize';
import { getTheme } from 'checkout/themes';

import { InitializationFailed } from './components';
import { useInitialize, usePaymentModel } from './hooks';

type AppLayoutProps = {
    initParams: InitParams;
};

export function AppLayout({ initParams }: AppLayoutProps) {
    const theme = getTheme(initParams.appConfig.fixedTheme);
    const { paymentModelState, initPaymentModel } = usePaymentModel();

    useEffect(() => {
        initPaymentModel(initParams);
    }, [initParams]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle theme={theme} />
            <AppWrapper>
                <Overlay />
                {paymentModelState.status === 'PROCESSING' && <LayoutLoader />}
                {paymentModelState.status === 'FAILURE' && <h1>FAILURE</h1>}
                {paymentModelState.status === 'STANDBY' && <h1>STANDBY</h1>}
            </AppWrapper>
        </ThemeProvider>
    );
}

export function App() {
    const { state, init } = useInitialize();

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            {state.status === 'SUCCESS' && <AppLayout initParams={state.data[1]} />}
            {state.status === 'FAILURE' && <InitializationFailed error={state.error} />}
        </>
    );
}
