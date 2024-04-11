import { isEmojiSupported } from './isEmojiSupported';

describe('isEmojiSupported', () => {
    let ctx;

    beforeEach(() => {
        // Mock the canvas context
        ctx = {
            fillStyle: '',
            fillRect: jest.fn(),
            textBaseline: '',
            font: '',
            fillText: jest.fn(),
            getImageData: jest.fn(),
        };
        // Setup to return a fake image data array
        ctx.getImageData.mockReturnValue({
            data: new Uint8ClampedArray(32 * 32 * 4).fill(0), // All pixels transparent
        });
        // Mock canvas creation
        document.createElement = jest.fn().mockReturnValue({
            getContext: () => ctx,
            width: 32,
            height: 32,
        });
    });

    test('should detect supported emoji by checking non-transparent pixels', () => {
        // Mocking the context to simulate an emoji being supported (non-transparent pixels)
        ctx.getImageData.mockReturnValue({
            data: new Uint8ClampedArray(32 * 32 * 4).fill(255), // All pixels non-transparent
        });

        expect(isEmojiSupported('😊')).toBe(true);
    });

    test('should detect unsupported emoji by checking all transparent pixels', () => {
        // Using the initial all-transparent setup by default

        expect(isEmojiSupported('😊')).toBe(false);
    });

    test('should handle null canvas context gracefully', () => {
        // Simulate canvas context not being available
        (document.createElement as any).mockReturnValue({
            getContext: () => null,
        });

        expect(isEmojiSupported('😊')).toBe(false);
    });
});
