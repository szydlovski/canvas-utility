const createPolygonPath = (ctx, points) => {
	const firstPoint = points.shift();
	ctx.beginPath();
	ctx.moveTo(firstPoint.x, firstPoint.y);
	let currentPoint;
	while (points.length > 0) {
		currentPoint = points.shift();
		ctx.lineTo(currentPoint.x, currentPoint.y);
	}
};

export const fillPolygon = (ctx, [...points]) => {
  createPolygonPath(ctx, points);
  ctx.fill();
}

export const strokePolygon = (ctx, [...points]) => {
  createPolygonPath(ctx, points);
  ctx.stroke();
}