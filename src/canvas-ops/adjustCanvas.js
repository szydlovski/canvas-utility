import { ImageDataHandle } from '../entities/ImageDataHandle.js';
import { createImageData } from '../internal/canvasImplementation.js';
import { createCanvas } from './createCanvas.js';

export function adjustCanvas(canvas, adjustment) {
	return createCanvas(canvas, (ctx) => {
    const imageData = ImageDataHandle.fromImage(canvas);
    const adjustedImageData = createImageData(imageData.mapPixels(adjustment), canvas.width);
    ctx.putImageData(adjustedImageData, 0, 0);
  });
}