import { lazy, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider } from 'styled-components';

import { ModalError } from './ModalError';
import { useInitModels } from './useInitModels';
import { toCustomizationContext } from './utils';
import { CustomizationContext } from '../../common/contexts';
import { InitParams } from '../../common/init';
import { getTheme } from '../../common/theme';
import { LayoutLoader, Overlay, AppWrapper, GlobalStyle, ErrorBoundaryFallback } from '../legacy';

type AppLayoutProps = {
    initParams: InitParams;
};

const GlobalContainer = lazy(() => import('../GlobalContainer/GlobalContainer'));

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
                        <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
                            <GlobalContainer
                                initConditions={modelsState.data.conditions}
                                paymentModel={modelsState.data.paymentModel}
                            />
                        </ErrorBoundary>
                    </CustomizationContext.Provider>
                )}
                {modelsState.status === 'FAILURE' && <ModalError error={modelsState.error} />}
            </AppWrapper>
        </ThemeProvider>
    );
}
