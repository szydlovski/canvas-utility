import { createCanvas } from './createCanvas.js';
import { clamp } from '../internal/helpers.js';
import { Drawable } from '../types.js';

export interface ResizeCanvasOptions {
	width?: number;
	height?: number;
	scale?: number;
	steps?: number;
}

// TODO: Look into the undefined/! thing

export function resizeCanvas(canvas: Drawable, options: ResizeCanvasOptions = {}) {
	const { width: sourceWidth, height: sourceHeight } = canvas;
	let { width: targetWidth, height: targetHeight, scale, steps = 1 }: ResizeCanvasOptions = options;
	steps = clamp(steps, 1, 10);

	// explicitly set width and/or height take precedence over scale
	if (targetWidth !== undefined || targetHeight !== undefined) {
		// explicitly set width and height take precedence over ratio
		if (targetWidth === undefined || targetHeight === undefined) {
			// only calculate from ratio if either is undefined
			if (targetWidth === undefined && targetHeight !== undefined) {
				// no width - calculate from ratio
				targetWidth = Math.round((sourceWidth / sourceHeight) * targetHeight);
			} else if (targetWidth !== undefined && targetHeight === undefined) {
				// no height - calculate from ratio
				targetHeight = Math.round((sourceHeight / sourceWidth) * targetWidth);
			}
		}
	}
	// no explicit width or height, try scale
	else if (scale !== undefined) {
		targetWidth = Math.round(sourceWidth * scale);
		targetHeight = Math.round(sourceHeight * scale);
	}
	// no explicit width or height, and no scale
	// use source dimensions
	// effectively copies the source
	else {
		const { width, height } = canvas;
		[targetWidth, targetHeight] = [width, height];
	}

	// calculate the amount by which to change dimensions with each step
	const widthStep = Math.round((targetWidth! - sourceWidth) / steps);
	const heightStep = Math.round((targetHeight! - sourceHeight) / steps);

	let render = canvas;

	// progressively scale the image
	for (let currentStep = 1; currentStep <= steps; currentStep++) {
		let currentWidth = sourceWidth + currentStep * widthStep;
		let currentHeight = sourceHeight + currentStep * heightStep;
		// due to rounding, the sum of steps may not be the same as the target dimensions
		// if it's the last step, just use the target dimensions
		if (currentStep === steps) {
			currentWidth = targetWidth!;
			currentHeight = targetHeight!;
		}
		render = createCanvas([currentWidth, currentHeight], (ctx) =>
			ctx.drawImage(render, 0, 0, currentWidth, currentHeight)
		);
	}

	return render as HTMLCanvasElement;
}
