import { createCanvas } from '../canvas-ops/createCanvas.js';
import { ImageDataHandle } from '../entities/ImageDataHandle.js';
import { Drawable } from '../types.js';
import { fillCircle } from './circle.js';

export const fillImage = (
	ctx: CanvasRenderingContext2D,
	image: Drawable,
	x = 0,
	y = 0,
	width = image.width,
	height = image.height
) =>
	ctx.drawImage(
		createCanvas(ctx.canvas, (tempCtx) => {
			tempCtx.fillStyle = ctx.fillStyle;
			tempCtx.drawImage(image, x, y, width, height);
			tempCtx.globalCompositeOperation = 'source-atop';
			tempCtx.fillRect(x, y, width, height);
		}),
		0,
		0
	);

export const strokeImage = (
	ctx: CanvasRenderingContext2D,
	image: Drawable,
	radius = 1,
	targetX = 0,
	targetY = 0,
	width = image.width,
	height = image.height
) => {
	ctx.save();
	ctx.fillStyle = ctx.strokeStyle;
	const imageData = ImageDataHandle.fromImage(image, width, height);
	imageData.forEachCoordinate((x, y) => {
		if (imageData.componentAt(x, y, 'a') === 0) return;
		if (imageData.hasNeighbor(x, y, ([, , , a]) => a < 255)) {
			fillCircle(ctx, targetX + x + 0.5, targetY + y + 0.5, radius - 0.5);
		}
	});
	ctx.restore();
};
