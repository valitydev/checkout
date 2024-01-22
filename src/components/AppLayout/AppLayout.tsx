import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

import { InitParams } from 'checkout/initialize';
import { getTheme } from 'checkout/themes';

import { toCustomizationContext } from './utils';
import { CustomizationContext, PaymentModelContext } from '../../common/contexts';
import { useInitPaymentModel } from '../../common/hooks';
import { GlobalContainer } from '../GlobalContainer';
import { LayoutLoader, Overlay, AppWrapper, GlobalStyle } from '../legacy';

type AppLayoutProps = {
    initParams: InitParams;
};

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
                            <GlobalContainer />
                        </CustomizationContext.Provider>
                    </PaymentModelContext.Provider>
                )}
                {state.status === 'FAILURE' && <p>FAILURE</p>}
            </AppWrapper>
        </ThemeProvider>
    );
}
