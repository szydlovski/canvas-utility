const createCirclePath = (ctx, x, y, radius) => {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
};

export const fillCircle = (ctx, x, y, radius) => {
	createCirclePath(ctx, x, y, radius);
	ctx.fill();
};

export const strokeCircle = (ctx, x, y, radius) => {
	createCirclePath(ctx, x, y, radius);
	ctx.stroke();
};
