import { ChakraBaseProvider, extendBaseTheme, theme as chakraTheme } from '@chakra-ui/react';
import { useEffect } from 'react';

import { ErrorAlert } from 'checkout/components';
import { CompletePaymentContext } from 'checkout/contexts';
import { extractError, isNil } from 'checkout/utils';

import { CommunicatorEvents } from './communicator';
import { AppLayout } from './components';
import { useInitialize } from './useInitialize';

const { Button, Spinner, Divider, Heading, Alert, Menu, Drawer, Popover } = chakraTheme.components;

const theme = extendBaseTheme({
    fonts: {
        body: 'Roboto, sans-serif',
        heading: 'Roboto, sans-serif',
        mono: 'monospace',
    },
    components: {
        Button,
        Spinner,
        Divider,
        Heading,
        Alert,
        Menu,
        Drawer,
        Popover,
    },
});

const ON_COMPLETE_TIMEOUT_MS = 1000 * 5;

export function App() {
    const { state, init } = useInitialize();

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (state.status === 'FAILURE' || state.status === 'SUCCESS') {
            const spinner = document.getElementById('global-spinner');
            if (spinner) spinner.style.display = 'none';
        }
    }, [state.status]);

    return (
        <ChakraBaseProvider theme={theme}>
            {state.status === 'SUCCESS' && (
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
                    <AppLayout initParams={state.data[1]} />
                </CompletePaymentContext.Provider>
            )}
            {state.status === 'FAILURE' && (
                <ErrorAlert
                    description={extractError(state.error)}
                    isReloading={false}
                    title="Initialization failure"
                />
            )}
        </ChakraBaseProvider>
    );
}
