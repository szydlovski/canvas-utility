import { Drawable } from '../types.js';
import { createCanvas } from './createCanvas.js';

export function mergeCanvases(...canvases: Drawable[]) {
	return createCanvas(canvases[0], (ctx) =>
		canvases.forEach((canvas) => ctx.drawImage(canvas, 0, 0))
	);
}
