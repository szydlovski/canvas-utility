import { copyCanvas } from './copyCanvas';
import { canvasConstructor } from '../internal/canvasImplementation';

export function getImageData(
	canvas,
	x = 0,
	y = 0,
	width = canvas.width,
	height = canvas.height
) {
	const targetCanvas =
		canvas instanceof canvasConstructor ? canvas : copyCanvas(canvas);
	const ctx = targetCanvas.getContext('2d');
	return ctx.getImageData(x, y, width, height);
}
