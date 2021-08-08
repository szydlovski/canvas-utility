import { copyCanvas } from './copyCanvas';
import { canvasConstructor } from '../internal/canvasImplementation';
import { Drawable } from '../types';

export function getImageData(
	canvas: Drawable,
	x = 0,
	y = 0,
	width = canvas.width,
	height = canvas.height
) {
	let targetCanvas: InstanceType<typeof canvasConstructor>, ctx: CanvasRenderingContext2D;
	if (canvas instanceof canvasConstructor) {
		targetCanvas = canvas;
		const context = targetCanvas.getContext('2d');
		if (context === null) {
			targetCanvas = copyCanvas(targetCanvas);
			ctx = targetCanvas.getContext('2d')!;
		} else {
			ctx = context;
		}
	} else {
		targetCanvas = copyCanvas(canvas);
		ctx = targetCanvas.getContext('2d')!;
	}
	return ctx.getImageData(x, y, width, height);
}
