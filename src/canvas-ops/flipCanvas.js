import { createCanvas } from './createCanvas.js';

export function flipCanvas(canvas) {
	return createCanvas(canvas, (ctx) => {
		ctx.translate(canvas.width, 0);
		ctx.scale(-1, 1);
		ctx.drawImage(canvas, 0, 0);
	});
}
