import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

import { InitConfig } from 'checkout/config';
import { InitParams } from 'checkout/initialize';
import { getTheme } from 'checkout/themes';

import { CustomizationContext, PaymentModelContext } from './common/contexts';
import { ContainerLayout, InitializationFailed } from './components';
import { LayoutLoader, Overlay, AppWrapper, GlobalStyle } from './components/legacy';
import { useInitialize, useInitPaymentModel } from './hooks';

type AppLayoutProps = {
    initParams: InitParams;
};

const toCustomizationContext = ({ name, description, locale }: InitConfig) => ({
    name,
    description,
    localeCode: locale,
});

export function AppLayout({ initParams }: AppLayoutProps) {
    const theme = getTheme(initParams.appConfig.fixedTheme);
    const { state, init } = useInitPaymentModel();

    useEffect(() => {
        init(initParams);
    }, [initParams]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle theme={theme} />
            <AppWrapper>
                <Overlay />
                {state.status === 'PROCESSING' && <LayoutLoader />}
                {state.status === 'STANDBY' && (
                    <PaymentModelContext.Provider value={{ model: state.data }}>
                        <CustomizationContext.Provider value={toCustomizationContext(initParams.initConfig)}>
                            <ContainerLayout />
                        </CustomizationContext.Provider>
                    </PaymentModelContext.Provider>
                )}
                {state.status === 'FAILURE' && <p>FAILURE</p>}
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
