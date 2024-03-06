import { resolveInteger } from './resolve-integer';

describe('resolve-integer', () => {
    test('wrong param value param should return null', () => {
        const actual = resolveInteger(null);
        expect(actual).toEqual(null);
    });

    test('int param should return 1', () => {
        const actual = resolveInteger(1);
        expect(actual).toEqual(1);
    });

    test('string int param should return 1', () => {
        const actual = resolveInteger('1');
        expect(actual).toEqual(1);
    });
});
