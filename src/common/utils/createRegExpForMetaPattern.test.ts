import { createRegExpForMetaPattern } from './createRegExpForMetaPattern';

describe('createRegExpForMetaPattern', () => {
    it('should create a RegExp with the unicode flag', () => {
        const pattern = '\\u{1F600}'; // Unicode code point for 😀
        const regex = createRegExpForMetaPattern(pattern);
        expect(regex.test('😀')).toBeTruthy();
    });

    it('should match unicode characters beyond the BMP', () => {
        const text = 'I love 🍕 and 🍔!';
        const emojiPattern = '\\u{1F354}|\\u{1F355}';
        const regex = createRegExpForMetaPattern(emojiPattern);
        expect(regex.test(text)).toBeTruthy();
    });

    it('should not match if the unicode character is not present', () => {
        const text = 'Just a plain text.';
        const emojiPattern = '\\u{1F600}';
        const regex = createRegExpForMetaPattern(emojiPattern);
        expect(regex.test(text)).toBeFalsy();
    });
});
