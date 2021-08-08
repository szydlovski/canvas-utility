import { createCanvas } from './createCanvas.js';
import { copyCanvas } from './copyCanvas.js';
import { Drawable } from '../types.js';

export function trimCanvas(source: Drawable) {
	// to allow trimming images, copy source to a new canvas
	const sourceCanvas = copyCanvas(source);
	const sourceContext = sourceCanvas.getContext('2d')!;
	const { width: sourceWidth, height: sourceHeight } = sourceCanvas;

	const pixels = sourceContext.getImageData(
		0,
		0,
		sourceWidth,
		sourceHeight
	).data;

	// looking for x and y boundaries
	let minX = sourceWidth,
		maxX = 0,
		minY = sourceHeight,
		maxY = 0;

	// loop through all the pixels
	for (let y = 0; y < sourceHeight; y++) {
		for (let x = 0; x < sourceWidth; x++) {
			const alphaIndex = y * 4 * sourceWidth + x * 4 + 3;
			const alpha = pixels[alphaIndex];
			// if it's not transparent, check if it's a new boundary
			if (alpha > 0) {
				minX = Math.min(minX, x);
				maxX = Math.max(maxX, x);
				minY = Math.min(minY, y);
				maxY = Math.max(maxY, y);
			}
		}
	}

	// +1 to keep the boundary pixels
	const targetWidth = maxX - minX + 1,
		targetHeight = maxY - minY + 1;

	const trimmedImageData = sourceContext.getImageData(
		minX,
		minY,
		targetWidth,
		targetHeight
	);

	return createCanvas([targetWidth, targetHeight], (ctx) =>
		ctx.putImageData(trimmedImageData, 0, 0)
	);
}
