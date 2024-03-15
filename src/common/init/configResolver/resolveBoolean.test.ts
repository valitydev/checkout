import { resolveBoolean } from './resolveBoolean';

describe('resolve-boolean', () => {
    test('wrong param should return null', () => {
        const actual = resolveBoolean('wrongValue');
        expect(actual).toEqual(null);
    });

    test('0 param value should return null', () => {
        const actual = resolveBoolean(0);
        expect(actual).toEqual(null);
    });

    test('1 param value should return null', () => {
        const actual = resolveBoolean(1);
        expect(actual).toEqual(null);
    });

    test('boolean true should return true', () => {
        const actual = resolveBoolean(true);
        expect(actual).toEqual(true);
    });

    test('string true value should return true', () => {
        const actual = resolveBoolean('true');
        expect(actual).toEqual(true);
    });

    test('boolean false should return false', () => {
        const actual = resolveBoolean(false);
        expect(actual).toEqual(false);
    });

    test('string false value should return false', () => {
        const actual = resolveBoolean('false');
        expect(actual).toEqual(false);
    });
});
