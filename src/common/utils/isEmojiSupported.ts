import { isNil } from './isNil';

// Tests flag emoji
export function isEmojiSupported(emoji: string): boolean {
    if (isNil(emoji)) {
        return false;
    }
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 32; // The size should be large enough to hold the emoji
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return false; // In case the browser doesn't support canvas
    }

    ctx.fillStyle = 'white'; // Background color
    ctx.fillRect(0, 0, 32, 32); // Fill the background
    ctx.textBaseline = 'top';
    ctx.font = '32px Arial'; // A common font that may not support the emoji

    ctx.fillText(emoji, 0, 0); // Draw the emoji on the canvas

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let isSupported = false;

    // Loop through pixel data; every four items in the array represent the RGBA values of a pixel
    for (let i = 0; i < imageData.length; i += 4) {
        const alpha = imageData[i + 3]; // Get the alpha value of the pixel
        if (alpha > 0) {
            // Check if the pixel is not completely transparent
            isSupported = true;
            break;
        }
    }

    return isSupported;
}
