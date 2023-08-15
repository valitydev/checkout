import { getMessageInvalidValue } from 'checkout/log-messages';

import { resolveObject } from './resolve-object';

jest.mock('../../log-messages');
const getMessageInvalidValueMock = getMessageInvalidValue as any;

it('wrong param value should return null', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const actual = resolveObject(null, 'someField');

    expect(warnSpy).not.toHaveBeenCalled();
    expect(actual).toEqual(null);

    warnSpy.mockRestore();
});

it('wrong param value should log warn message', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const logMock = 'some log';
    getMessageInvalidValueMock.mockReturnValueOnce(logMock);
    const actual = resolveObject([], 'someField');
    expect(warnSpy.mock.calls[0][0]).toEqual(logMock);
    expect(actual).toEqual(null);

    warnSpy.mockRestore();
});

it('string should log warn message', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const logMock = 'some log';
    getMessageInvalidValueMock.mockReturnValueOnce(logMock);
    const actual = resolveObject(' string ', 'someField');

    expect(warnSpy.mock.calls[0][0]).toEqual(logMock);
    expect(actual).toEqual(null);

    warnSpy.mockRestore();
});

it('stringify array should log warn message', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const logMock = 'some log';
    getMessageInvalidValueMock.mockReturnValueOnce(logMock);
    const actual = resolveObject('[]', 'someField');

    expect(warnSpy.mock.calls[0][0]).toEqual(logMock);
    expect(actual).toEqual(null);

    warnSpy.mockRestore();
});

it('object param should return object', () => {
    const obj = { metadata: 'test' };
    const actual = resolveObject({ ...obj }, 'someField');
    expect(actual).toEqual(obj);
});

it('stringify object param should return object', () => {
    const obj = { metadata: 'test' };
    const actual = resolveObject(JSON.stringify(obj), 'someField');
    expect(actual).toEqual(obj);
});
