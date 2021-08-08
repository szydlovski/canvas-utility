const createCirclePath = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
};

export const fillCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
	createCirclePath(ctx, x, y, radius);
	ctx.fill();
};

export const strokeCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
	createCirclePath(ctx, x, y, radius);
	ctx.stroke();
};
