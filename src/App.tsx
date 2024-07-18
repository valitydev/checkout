import { ChakraBaseProvider, extendBaseTheme, theme as chakraTheme } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { ErrorAlert } from 'checkout/components';
import { CompletePaymentContext } from 'checkout/contexts';
import { extractError, isNil } from 'checkout/utils';

import { CommunicatorEvents } from './communicator';
import { AppLayout } from './components';
import { Menu } from './theme';
import { useInitialize } from './useInitialize';

const { Button, Spinner, Divider, Heading, Alert, Drawer, Input } = chakraTheme.components;

const common = {
    useSystemColorMode: false,
    components: {
        Button,
        Spinner,
        Divider,
        Heading,
        Alert,
        Menu,
        Drawer,
        Input,
    },
};

const defaultTheme = {
    initialColorMode: 'light',
    fonts: {
        body: 'Roboto, sans-serif',
        heading: 'Roboto, sans-serif',
        mono: 'monospace',
    },
    colors: {
        brand: {
            50: '#E6FFFA',
            100: '#B2F5EA',
            200: '#81E6D9',
            300: '#4FD1C5',
            400: '#38B2AC',
            500: '#319795',
            600: '#2C7A7B',
            700: '#285E61',
            800: '#234E52',
            900: '#1D4044',
        },
        menuBg: {
            default: '#fff',
        },
    },
    styles: {
        global: {
            body: {
                bg: '#163735',
            },
        },
    },
    QRCode: {
        back: '#fff',
        fill: '#1A202C',
    },
    ViewContainer: {
        mainContainerBg: 'gray.100',
        viewContainerBg: '#fff',
    },
    Loader: {
        bg: 'whiteAlpha.800',
    },
};

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
                        <AppLayout
                            colorMode={theme.initialColorMode}
                            initParams={state.data[1]}
                            styledComponentsTheme={theme?.__styledComponents}
                        />
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
