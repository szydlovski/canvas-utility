import { Drawable } from '../types.js';
import { createCanvas } from './createCanvas.js';

export function copyCanvas(canvas: Drawable) {
	return createCanvas(canvas, ctx => ctx.drawImage(canvas, 0, 0));
}