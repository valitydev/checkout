import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

import { InitParams } from 'checkout/initialize';
import { getTheme } from 'checkout/themes';

import { useInitModels } from './useInitModels';
import { toCustomizationContext } from './utils';
import { CustomizationContext } from '../../common/contexts';
import { GlobalContainer } from '../GlobalContainer';
import { LayoutLoader, Overlay, AppWrapper, GlobalStyle } from '../legacy';

type AppLayoutProps = {
    initParams: InitParams;
};

export function AppLayout({ initParams }: AppLayoutProps) {
    const theme = getTheme(initParams.appConfig.fixedTheme);
    const { modelsState, init } = useInitModels();

    useEffect(() => {
        init(initParams);
    }, [initParams]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle theme={theme} />
            <AppWrapper>
                <Overlay />
                {modelsState.status === 'PROCESSING' && <LayoutLoader />}
                {modelsState.status === 'INITIALIZED' && (
                    <CustomizationContext.Provider value={toCustomizationContext(initParams.initConfig)}>
                        <GlobalContainer
                            initConditions={modelsState.data.conditions}
                            paymentModel={modelsState.data.paymentModel}
                        />
                    </CustomizationContext.Provider>
                )}
                {modelsState.status === 'FAILURE' && <p>FAILURE</p>}
            </AppWrapper>
        </ThemeProvider>
    );
}
