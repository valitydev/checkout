import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const helpers = createMultiStyleConfigHelpers(['list', 'item']);

export const Menu = helpers.defineMultiStyleConfig({
    baseStyle: {
        list: {
            '--menu-bg': 'colors.menuBg.default',
            '--menu-shadow': 'shadows.sm',
            _dark: {
                '--menu-bg': 'colors.menuBg._dark',
                '--menu-shadow': 'shadows.dark-lg',
            },
            color: 'inherit',
            minW: '3xs',
            py: '2',
            zIndex: 1,
            borderRadius: 'md',
            borderWidth: '1px',
            bg: 'var(--menu-bg)',
            boxShadow: 'var(--menu-shadow)',
        },
        item: {
            py: '1.5',
            px: '3',
            transitionProperty: 'background',
            transitionDuration: 'ultra-fast',
            transitionTimingFunction: 'ease-in',
            _focus: {
                '--menu-bg': 'colors.gray.100',
                _dark: {
                    '--menu-bg': 'colors.whiteAlpha.100',
                },
            },
            _active: {
                '--menu-bg': 'colors.gray.200',
                _dark: {
                    '--menu-bg': 'colors.whiteAlpha.200',
                },
            },
            _expanded: {
                '--menu-bg': 'colors.gray.100',
                _dark: {
                    '--menu-bg': 'colors.whiteAlpha.100',
                },
            },
            _disabled: {
                opacity: 0.4,
                cursor: 'not-allowed',
            },
            bg: 'var(--menu-bg)',
        },
    },
});
