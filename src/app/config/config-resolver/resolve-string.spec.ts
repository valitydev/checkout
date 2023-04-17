import { resolveString } from './resolve-string';
import { getMessageInvalidValue } from 'checkout/log-messages';

jest.mock('../../log-messages');
const getMessageInvalidValueMock = getMessageInvalidValue as any;

it('wrong param value should return null', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const actual = resolveString(null, 'someField');
    expect(actual).toEqual(null);
    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
});

it('wrong param value should log warn message', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const logMock = 'some log';
    getMessageInvalidValueMock.mockReturnValueOnce(logMock);
    resolveString(999, 'someField');

    expect(warnSpy.mock.calls[0][0]).toEqual(logMock);

    warnSpy.mockReset();
});

it('empty string should log warn message', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const logMock = 'some log';
    getMessageInvalidValueMock.mockReturnValueOnce(logMock);
    resolveString(' ', 'someField');

    expect(warnSpy.mock.calls[0][0]).toEqual(logMock);

    warnSpy.mockReset();
});

it('string param should return trimmed string', () => {
    const actual = resolveString(' some value ', 'someField');
    expect(actual).toEqual('some value');
});
