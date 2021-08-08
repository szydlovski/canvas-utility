import { ImageDataHandle } from '../entities/ImageDataHandle.js';
import { createImageData } from '../internal/canvasImplementation.js';
import { Drawable } from '../types.js';
import { createCanvas } from './createCanvas.js';

export type AdjustmentCallback = Parameters<typeof ImageDataHandle.prototype.mapPixels>[0];

export function adjustCanvas(canvas: Drawable, adjustment: AdjustmentCallback) {
	return createCanvas(canvas, (ctx) => {
    const imageData = ImageDataHandle.fromImage(canvas);
    const adjustedImageData = createImageData(imageData.mapPixels(adjustment), canvas.width);
    ctx.putImageData(adjustedImageData, 0, 0);
  });
}