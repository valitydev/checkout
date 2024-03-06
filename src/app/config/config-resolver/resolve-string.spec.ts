import { resolveString } from './resolve-string';

it('wrong param value should return null', () => {
    const actual = resolveString(null);
    expect(actual).toEqual(null);
});

it('string param should return trimmed string', () => {
    const actual = resolveString(' some value ');
    expect(actual).toEqual('some value');
});
