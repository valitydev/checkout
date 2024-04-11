import { ChakraBaseProvider, extendBaseTheme, theme as chakraTheme } from '@chakra-ui/react';
import { useEffect } from 'react';

import { CompletePaymentContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

import { CommunicatorEvents } from './communicator';
import { InitializationFailed, AppLayout } from './components';
import { useInitialize } from './useInitialize';

const { Button, Spinner, Divider, Heading, Alert, Skeleton, Menu, Drawer } = chakraTheme.components;

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
        Skeleton,
        Menu,
        Drawer,
    },
});

const ON_COMPLETE_TIMEOUT_MS = 1000 * 5;

export function App() {
    const { state, init } = useInitialize();

    useEffect(() => {
        init();
    }, []);

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
            {state.status === 'FAILURE' && <InitializationFailed error={state.error} />}
        </ChakraBaseProvider>
    );
}
