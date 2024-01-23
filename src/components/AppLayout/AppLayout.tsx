import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

import { InitParams } from 'checkout/initialize';
import { getTheme } from 'checkout/themes';

import { useInitPaymentModel } from './useInitPaymentModel';
import { toCustomizationContext } from './utils';
import { CustomizationContext } from '../../common/contexts';
import { GlobalContainer } from '../GlobalContainer';
import { LayoutLoader, Overlay, AppWrapper, GlobalStyle } from '../legacy';

type AppLayoutProps = {
    initParams: InitParams;
};

export function AppLayout({ initParams }: AppLayoutProps) {
    const theme = getTheme(initParams.appConfig.fixedTheme);
    const { initPaymentModelState, init } = useInitPaymentModel();

    useEffect(() => {
        init(initParams);
    }, [initParams]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle theme={theme} />
            <AppWrapper>
                <Overlay />
                {initPaymentModelState.status === 'PROCESSING' && <LayoutLoader />}
                {initPaymentModelState.status === 'STANDBY' && (
                    <CustomizationContext.Provider value={toCustomizationContext(initParams.initConfig)}>
                        <GlobalContainer initPaymentModel={initPaymentModelState.data} />
                    </CustomizationContext.Provider>
                )}
                {initPaymentModelState.status === 'FAILURE' && <p>FAILURE</p>}
            </AppWrapper>
        </ThemeProvider>
    );
}
