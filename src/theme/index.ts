import { theme as chakraTheme } from '@chakra-ui/react';

import { Menu } from './components/Menu';

const { Button, Spinner, Divider, Heading, Alert, Modal, Drawer, Input } = chakraTheme.components;

export const common = {
    useSystemColorMode: false,
    components: {
        Button,
        Spinner,
        Divider,
        Heading,
        Alert,
        Modal,
        Menu,
        Drawer,
        Input,
    },
};

export const defaultTheme = {
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
