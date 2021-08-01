import { createCanvas } from './createCanvas.js';

export function copyCanvas(canvas) {
	return createCanvas(canvas, ctx => ctx.drawImage(canvas, 0, 0));
}