import { resolveObject } from './resolveObject';

it('wrong param value should return null', () => {
    const actual = resolveObject(null);
    expect(actual).toEqual(null);
});

it('wrong param value should log warn message', () => {
    const actual = resolveObject([]);
    expect(actual).toEqual(null);
});

it('string should log warn message', () => {
    const actual = resolveObject(' string ');

    expect(actual).toEqual(null);
});

it('stringify array should log warn message', () => {
    const actual = resolveObject('[]');
    expect(actual).toEqual(null);
});

it('object param should return object', () => {
    const obj = { metadata: 'test' };
    const actual = resolveObject({ ...obj });
    expect(actual).toEqual(obj);
});

it('stringify object param should return object', () => {
    const obj = { metadata: 'test' };
    const actual = resolveObject(JSON.stringify(obj));
    expect(actual).toEqual(obj);
});
