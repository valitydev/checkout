import { Flex } from '@chakra-ui/react';
import { lazy, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider } from 'styled-components';

import { ModalError } from './ModalError';
import { useInitModels } from './useInitModels';
import { toCustomizationContext } from './utils';
import { CustomizationContext } from '../../common/contexts';
import { InitParams } from '../../common/init';
import { getTheme } from '../../common/theme';
import { ErrorBoundaryFallback } from '../legacy';

type AppLayoutProps = {
    initParams: InitParams;
};

const GlobalContainer = lazy(() => import('../GlobalContainer/GlobalContainer'));

const ModalContainer = ({ children }: { children: React.ReactNode }) => (
    <Flex
        alignItems="center"
        flexDirection="column"
        height="100dvh"
        justifyContent={['start', 'start', 'center']}
        left={0}
        overflow="auto"
        overscroll-behavior-y="none"
        position="fixed"
        top={0}
        width="100vw"
    >
        {children}
    </Flex>
);

export function AppLayout({ initParams }: AppLayoutProps) {
    const theme = getTheme(initParams.appConfig.fixedTheme);
    const { modelsState, init } = useInitModels();

    useEffect(() => {
        init(initParams);
    }, [initParams]);

    return (
        <ThemeProvider theme={theme}>
            <ModalContainer>
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
            </ModalContainer>
        </ThemeProvider>
    );
}
