import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { ErrorAlert } from 'checkout/components';
import { CompletePaymentContext } from 'checkout/contexts';
import { extractError, isNil } from 'checkout/utils';

import { CommunicatorEvents } from './communicator';
import { AppLayout } from './components';
import { common, defaultTheme } from './theme';
import { useInitialize } from './useInitialize';

const ON_COMPLETE_TIMEOUT_MS = 1000 * 5;

export function App() {
    const { state, init } = useInitialize();
    const [theme, setTheme] = useState(extendBaseTheme({ ...common, ...defaultTheme }));

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (state.status === 'FAILURE' || state.status === 'SUCCESS') {
            const spinner = document.getElementById('global-spinner');
            if (spinner) spinner.style.display = 'none';
        }
    }, [state.status]);

    useEffect(() => {
        if (state.status === 'SUCCESS') {
            const themes = state.data[1].appConfig?.themes;
            if (isNil(themes) || themes.length === 0) return;

            const initConfigThemeName = state.data[1].initConfig?.theme;
            if (isNil(initConfigThemeName)) return;

            const customTheme = themes.find((t) => t.themeName === initConfigThemeName);
            if (isNil(customTheme)) return;

            setTheme(extendBaseTheme({ ...common, ...customTheme }));
        }
    }, [state.status]);

    return (
        <>
            {state.status === 'SUCCESS' && (
                <ChakraBaseProvider theme={theme}>
                    <CompletePaymentContext.Provider
                        value={{
                            onComplete: () =>
                                setTimeout(() => {
                                    const [transport, params] = state.data;
                                    transport.emit(CommunicatorEvents.finished);
                                    transport.destroy();
                                    const redirectUrl = params.initConfig?.redirectUrl;
                                    if (!isNil(redirectUrl)) {
                                        window.open(redirectUrl, '_self');
                                    }
                                }, ON_COMPLETE_TIMEOUT_MS),
                        }}
                    >
                        <AppLayout colorMode={theme.initialColorMode} initParams={state.data[1]} />
                    </CompletePaymentContext.Provider>
                </ChakraBaseProvider>
            )}
            {state.status === 'FAILURE' && (
                <ErrorAlert
                    description={extractError(state.error)}
                    isReloading={false}
                    title="Initialization failure"
                />
            )}
        </>
    );
}
