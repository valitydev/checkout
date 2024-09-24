import { Flex, useColorMode } from '@chakra-ui/react';
import { lazy, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorAlert, GlobalSpinner } from 'checkout/components';
import { CustomizationContext, LocaleContext } from 'checkout/contexts';
import { InitParams } from 'checkout/init';
import { extractError, sendPostMessage } from 'checkout/utils';

import { useInitModels } from './useInitModels';
import { useLocale } from './useLocale';
import { toCustomizationContext } from './utils';

type AppLayoutProps = {
    initParams: InitParams;
    colorMode: string;
};

const GlobalContainer = lazy(() => import('../GlobalContainer/GlobalContainer'));

const ModalContainer = ({ children }: { children: React.ReactNode }) => (
    <Flex
        alignItems="center"
        flexDirection="column"
        height="100vh"
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

export function AppLayout({ initParams, colorMode }: AppLayoutProps) {
    const { setColorMode } = useColorMode();
    const { modelsState, init } = useInitModels();
    const customizationContextValue = toCustomizationContext(initParams.initConfig);
    const initLocaleCode = customizationContextValue.initLocaleCode;
    const {
        localeState: { l, localeCode },
        changeLocale,
    } = useLocale(initLocaleCode);

    useEffect(() => {
        init(initParams);
    }, [initParams]);

    useEffect(() => {
        setColorMode(colorMode);
    }, [colorMode]);

    useEffect(() => {
        if (modelsState.status === 'FAILURE') {
            sendPostMessage('onError');
        }
    }, [modelsState]);

    return (
        <LocaleContext.Provider value={{ l, localeCode, changeLocale }}>
            <ModalContainer>
                {modelsState.status === 'PROCESSING' && <GlobalSpinner l={l} />}
                {modelsState.status === 'INITIALIZED' && (
                    <CustomizationContext.Provider value={customizationContextValue}>
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
        </LocaleContext.Provider>
    );
}
