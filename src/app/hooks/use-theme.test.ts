import { renderHook } from '@testing-library/react';

import { ThemeName } from 'checkout/themes';
import plantation from 'checkout/themes/plantation';
import rhino from 'checkout/themes/rhino';

import { useTheme } from './use-theme';

describe('useTheme', () => {
    test('should apply init config theme', () => {
        const { result } = renderHook(() =>
            useTheme({
                appConfig: {
                    fixedTheme: ThemeName.plantation,
                },
                initConfig: {
                    theme: 'rhino',
                },
                origin: '',
            }),
        );

        expect(result.current).toStrictEqual(rhino);
    });

    test('should apply fixedTheme theme', () => {
        const { result } = renderHook(() =>
            useTheme({
                appConfig: {
                    fixedTheme: ThemeName.plantation,
                },
                initConfig: {},
                origin: '',
            }),
        );

        expect(result.current).toStrictEqual(plantation);
    });

    test('should apply default theme', () => {
        const { result } = renderHook(() =>
            useTheme({
                appConfig: {},
                initConfig: {},
                origin: '',
            }),
        );

        expect(result.current).toStrictEqual(plantation);
    });

    test('should apply initConfig theme', () => {
        const { result } = renderHook(() =>
            useTheme({
                appConfig: {},
                initConfig: {
                    theme: 'rhino',
                },
                origin: '',
            }),
        );

        expect(result.current).toStrictEqual(rhino);
    });
});
