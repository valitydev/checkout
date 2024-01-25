import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

import { InitParams } from 'checkout/initialize';
import { getTheme } from 'checkout/themes';

import { usePaymentModel } from './usePaymentModel';
import { toCustomizationContext } from './utils';
import { CustomizationContext } from '../../common/contexts';
import { GlobalContainer } from '../GlobalContainer';
import { LayoutLoader, Overlay, AppWrapper, GlobalStyle } from '../legacy';

type AppLayoutProps = {
    initParams: InitParams;
};

export function AppLayout({ initParams }: AppLayoutProps) {
    const theme = getTheme(initParams.appConfig.fixedTheme);
    const { paymentModelState, init } = usePaymentModel();

    useEffect(() => {
        init(initParams);
    }, [initParams]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle theme={theme} />
            <AppWrapper>
                <Overlay />
                {paymentModelState.status === 'PROCESSING' && <LayoutLoader />}
                {paymentModelState.status === 'INITIALIZED' && (
                    <CustomizationContext.Provider value={toCustomizationContext(initParams.initConfig)}>
                        <GlobalContainer paymentModel={paymentModelState.data} />
                    </CustomizationContext.Provider>
                )}
                {paymentModelState.status === 'FAILURE' && <p>FAILURE</p>}
            </AppWrapper>
        </ThemeProvider>
    );
}
