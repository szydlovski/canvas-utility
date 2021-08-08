import { Rectangle, Point, Angle } from '@szydlovski/geometry';
import { Drawable } from '../types.js';
import { createCanvas } from './createCanvas.js';

export function rotateCanvas(canvas: Drawable, angle: Angle | number) {
	const angleRadians =
		angle instanceof Angle ? angle.radians : Angle.fromDegrees(angle).radians;
	const canvasRectangle = Rectangle.fromOriginAndDimensions(
		new Point(0, 0),
		canvas
	);
	const rotatedBoundingBox = canvasRectangle.rotate(angleRadians).boundingBox;
	const width = Math.round(rotatedBoundingBox.width),
		height = Math.round(rotatedBoundingBox.height);
	return createCanvas({ width, height }, (ctx) => {
		ctx.translate(width / 2, height / 2);
		ctx.rotate(angleRadians);
		ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
	});
}
