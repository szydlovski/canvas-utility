import { Drawable } from '../types.js';
import { createCanvas } from './createCanvas.js';

export function maskCanvas(canvas: Drawable, mask: Drawable) {
	return createCanvas(canvas, ctx => {
    ctx.drawImage(mask, 0, 0);
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(canvas, 0,0 );
  });
}