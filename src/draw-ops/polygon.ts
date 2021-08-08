import { Pointlike } from "@szydlovski/geometry/dist/Types";

const createPolygonPath = (ctx: CanvasRenderingContext2D, points: Pointlike[]) => {
	if (points.length < 3) {
		throw new Error('Polygon must have at least 3 points.')
	}
	const firstPoint = points.shift()!;
	ctx.beginPath();
	ctx.moveTo(firstPoint.x, firstPoint.y);
	let currentPoint;
	while (points.length > 0) {
		currentPoint = points.shift()!;
		ctx.lineTo(currentPoint.x, currentPoint.y);
	}
};

export const fillPolygon = (ctx: CanvasRenderingContext2D, [...points]: Pointlike[]) => {
  createPolygonPath(ctx, points);
  ctx.fill();
}

export const strokePolygon = (ctx: CanvasRenderingContext2D, [...points]: Pointlike[]) => {
  createPolygonPath(ctx, points);
  ctx.stroke();
}