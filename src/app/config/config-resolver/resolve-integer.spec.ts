import { resolveInteger } from './resolve-integer';
import { getMessageInvalidValue } from 'checkout/log-messages';

jest.mock('../../log-messages');
const getMessageInvalidValueMock = getMessageInvalidValue as any;

describe('resolve-integer', () => {
    test('wrong param value param should return null', () => {
        const logSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        const actual = resolveInteger(null, 'someField');
        expect(actual).toEqual(null);

        logSpy.mockRestore();
    });

    test('wrong param value should log warn message', () => {
        const logSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        const logMock = 'some log';
        getMessageInvalidValueMock.mockReturnValueOnce(logMock);
        resolveInteger('wrongValue', 'someField');
        expect(logSpy.mock.calls[0][0]).toEqual(logMock);

        logSpy.mockRestore();
    });

    test('int param should return 1', () => {
        const actual = resolveInteger(1, 'someField');
        expect(actual).toEqual(1);
    });

    test('string int param should return 1', () => {
        const actual = resolveInteger('1', 'someField');
        expect(actual).toEqual(1);
    });
});
