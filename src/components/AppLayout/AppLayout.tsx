import { Flex } from '@chakra-ui/react';
import { lazy, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider } from 'styled-components';

import { ErrorAlert } from 'checkout/components';
import { CustomizationContext } from 'checkout/contexts';
import { InitParams } from 'checkout/init';
import { getTheme } from 'checkout/theme';
import { extractError } from 'checkout/utils';

import { useInitModels } from './useInitModels';
import { toCustomizationContext } from './utils';

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

    useEffect(() => {
        if (modelsState.status === 'INITIALIZED' || modelsState.status === 'FAILURE') {
            const spinner = document.getElementById('global-spinner');
            if (spinner) spinner.style.display = 'none';
        }
    }, [modelsState.status]);

    return (
        <ThemeProvider theme={theme}>
            <ModalContainer>
                {modelsState.status === 'INITIALIZED' && (
                    <CustomizationContext.Provider value={toCustomizationContext(initParams.initConfig)}>
                        <ErrorBoundary
                            fallback={
                                <ErrorAlert
                                    description="Try reloading"
                                    isReloading={true}
                                    title="Something went wrong"
                                />
                            }
                        >
                            <GlobalContainer
                                initConditions={modelsState.data.conditions}
                                paymentModel={modelsState.data.paymentModel}
                            />
                        </ErrorBoundary>
                    </CustomizationContext.Provider>
                )}
                {modelsState.status === 'FAILURE' && (
                    <ErrorAlert
                        description={extractError(modelsState.error)}
                        isReloading={false}
                        title="Initialization failure"
                    />
                )}
            </ModalContainer>
        </ThemeProvider>
    );
}
