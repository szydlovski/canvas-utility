import { createCanvas } from './createCanvas.js';

export function mergeCanvases(...canvases) {
	return createCanvas(canvases[0], (ctx) =>
		canvases.forEach((canvas) => ctx.drawImage(canvas, 0, 0))
	);
}
