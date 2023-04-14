import { resolveBoolean } from './resolve-boolean';
import { getMessageInvalidValue } from '../../log-messages';

jest.mock('../../log-messages');

describe('resolve-boolean', () => {
    const getMessageInvalidValueMock = getMessageInvalidValue as any;
    test('wrong param should return null', () => {
        const logSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        const actual = resolveBoolean('wrongValue', 'someFiled');
        expect(actual).toEqual(null);

        logSpy.mockRestore();
    });

    test('0 param value should return null', () => {
        const logSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        const actual = resolveBoolean(0, 'someFiled');
        expect(actual).toEqual(null);

        logSpy.mockRestore();
    });

    test('1 param value should return null', () => {
        const logSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        const actual = resolveBoolean(1, 'someFiled');
        expect(actual).toEqual(null);

        logSpy.mockRestore();
    });

    test('wrong param should log warn', () => {
        const logSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        const logMock = 'some log';
        getMessageInvalidValueMock.mockReturnValueOnce(logMock);
        resolveBoolean('wrongValue', 'someFiled');
        expect(logSpy.mock.calls[0][0]).toEqual(logMock);

        logSpy.mockRestore();
    });

    test('false param should not call log warn', () => {
        const logSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        resolveBoolean(false, 'someFiled');
        expect(logSpy.mock.calls[0]).toBeUndefined();

        logSpy.mockRestore();
    });

    test('boolean true should return true', () => {
        const actual = resolveBoolean(true, 'someFiled');
        expect(actual).toEqual(true);
    });

    test('string true value should return true', () => {
        const actual = resolveBoolean('true', 'someFiled');
        expect(actual).toEqual(true);
    });

    test('boolean false should return false', () => {
        const actual = resolveBoolean(false, 'someFiled');
        expect(actual).toEqual(false);
    });

    test('string false value should return false', () => {
        const actual = resolveBoolean('false', 'someFiled');
        expect(actual).toEqual(false);
    });
});
