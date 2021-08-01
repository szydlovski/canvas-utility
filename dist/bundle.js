function loadImage(path) {
	return new Promise((resolve) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.src = path;
	});
}

function createCanvas(width, height) {
	return Object.assign(document.createElement('canvas'), { width, height });
}

function createImageData(...args) {
  return new ImageData(...args);
}

const canvasConstructor = HTMLCanvasElement;

var browserCanvas = /*#__PURE__*/Object.freeze({
	__proto__: null,
	loadImage: loadImage,
	createCanvas: createCanvas,
	createImageData: createImageData,
	canvasConstructor: canvasConstructor
});

var createCanvas$1, canvasConstructor$1, loadImage$1, createImageData$1;
setCanvasImplementation(browserCanvas);

function setCanvasImplementation(newImplementation) {
	// TODO - maybe some validation
	({ createCanvas: createCanvas$1, canvasConstructor: canvasConstructor$1, loadImage: loadImage$1, createImageData: createImageData$1 } = newImplementation);
}

const isInteger = (...values) =>
	values.every((value) => Number.isInteger(value));

function createCanvas$2 (source, callback) {
	let width, height;

	// object dimensions {width, height}
	// works for canvases, images etc.
	if (isInteger(source.width, source.height)) {
		({ width, height } = source);
	}
	// array dimensions [width, height]
	else if (isInteger(source[0], source[1])) {
		[width, height] = source;
	}
	// sinngle integer dimensions widthAndHeight
	else if (isInteger(source)) {
		(width = source), (height = source);
	}
	// revert to default
	else {
		console.warn('No dimensions provided for createCanvas');
		(width = 100), (height = 100);
	}
	const canvas = createCanvas$1(width, height);
	const context = canvas.getContext('2d');
	if (callback) callback(context, canvas);
	return canvas;
}

function clamp(value, min, max) {
  return value > max ? max : value < min ? min : value;
}

function parseRatio(ratio) {
	const match = ratio.match(/([0-9]+):([0-9]+)/);
	if (match === null) {
		throw new Error(`Invalid ratio: ${ratio}`);
	}
	return match.slice(1).map((value) => parseInt(value));
}

function resizeCanvas(canvas, opts = {}) {
	const options = Object.assign(
		{
			width: undefined,
			height: undefined,
			scale: undefined,
			steps: 1,
		},
		opts
	);
	const { width: sourceWidth, height: sourceHeight } = canvas;
	let { width: targetWidth, height: targetHeight, scale, steps } = options;
	steps = clamp(steps, 1, 10);

	// explicitly set width and/or height take precedence over scale
	if (targetWidth !== undefined || targetHeight !== undefined) {
		// explicitly set width and height take precedence over ratio
		// only calculate from ratio if either is undefined
		if (targetWidth === undefined || targetHeight === undefined) {
			// no width - calculate from ratio
			if (targetWidth === undefined) {
				targetWidth = Math.round((sourceWidth / sourceHeight) * targetHeight);
				// no height - calculate from ratio
			} else {
				targetHeight = Math.round((sourceHeight / sourceWidth) * targetWidth);
			}
		}
	}
	// no explicit width or height, try scale
	else if (scale !== undefined) {
		targetWidth = Math.round(sourceWidth * scale);
		targetHeight = Math.round(sourceHeight * scale);
	}
	// no explicit width or height, and no scale
	// use source dimensions
	// effectively copies the source
	else {
		({ targetWidth, targetHeight } = source);
	}

	// calculate the amount by which to change dimensions with each step
	const widthStep = Math.round((targetWidth - sourceWidth) / steps);
	const heightStep = Math.round((targetHeight - sourceHeight) / steps);

	let render = canvas;

	// progressively scale the image
	for (let currentStep = 1; currentStep <= steps; currentStep++) {
		let currentWidth = sourceWidth + currentStep * widthStep;
		let currentHeight = sourceHeight + currentStep * heightStep;
		// due to rounding, the sum of steps may not be the same as the target dimensions
		// if it's the last step, just use the target dimensions
		if (currentStep === steps) {
			currentWidth = targetWidth;
			currentHeight = targetHeight;
		}
		render = createCanvas$2([currentWidth, currentHeight], (ctx) =>
			ctx.drawImage(render, 0, 0, currentWidth, currentHeight)
		);
	}

	return render;
}

function copyCanvas(canvas) {
	return createCanvas$2(canvas, ctx => ctx.drawImage(canvas, 0, 0));
}

function cropCanvas(source, ratio = '1:1') {
	// extract numbers from ratio string
	const [widthRatio, heightRatio] = parseRatio(ratio);
	const { width: sourceWidth, height: sourceHeight } = source;

	let targetWidth, targetHeight;
	// wide target - source width stays, height from ratio
	if (widthRatio > heightRatio) {
		targetWidth = sourceWidth;
		targetHeight = sourceWidth * (heightRatio / widthRatio);
		// not tall enough - scale down
		if (targetHeight > sourceHeight) {
			targetWidth = sourceHeight * (widthRatio / heightRatio);
			targetHeight = sourceHeight;
		}
	}
	// tall target - source height stays, width from ratio
	else if (widthRatio < heightRatio) {
		targetWidth = sourceHeight * (widthRatio / heightRatio);
		targetHeight = sourceHeight;
		// not wide enough - scale down
		if (targetWidth > sourceWidth) {
			targetWidth = sourceWidth;
			targetHeight = sourceWidth * (heightRatio / widthRatio);
		}
	}
	// ratio is 1:1, keep the smaller dimension
	else {
		const smallerDimension =
			sourceWidth < sourceHeight ? sourceWidth : sourceHeight;
		targetWidth = smallerDimension;
		targetHeight = smallerDimension;
	}
	targetWidth = Math.round(targetWidth);
	targetHeight = Math.round(targetHeight);
	return createCanvas$2([targetWidth, targetHeight], (ctx) => {
		// position in the center
		// TODO - add options for positioning
		const x = (targetWidth - sourceWidth) / 2;
		const y = (targetHeight - sourceHeight) / 2;
		ctx.drawImage(source, x, y);
	});
}

function trimCanvas(source) {
	// to allow trimming images, copy source to a new canvas
	const sourceCanvas = copyCanvas(source);
	const sourceContext = sourceCanvas.getContext('2d');
	const { width: sourceWidth, height: sourceHeight } = sourceCanvas;

	const pixels = sourceContext.getImageData(0, 0, sourceWidth, sourceHeight)
		.data;

	// looking for x and y boundaries
	let minX = sourceWidth,
		maxX = 0,
		minY = sourceHeight,
		maxY = 0;

  // loop through all the pixels
	for (let y = 0; y < sourceHeight; y++) {
		for (let x = 0; x < sourceWidth; x++) {
      const alphaIndex = y * 4 * sourceWidth + x * 4 + 3;
      const alpha = pixels[alphaIndex];
      // if it's not transparent, check if it's a new boundary
			if (alpha > 0) {
				minX = Math.min(minX, x);
				maxX = Math.max(maxX, x);
				minY = Math.min(minY, y);
				maxY = Math.max(maxY, y);
			}
		}
	}

	// +1 to keep the boundary pixels
	const targetWidth = maxX - minX + 1,
		targetHeight = maxY - minY + 1;

	const trimmedImageData = sourceContext.getImageData(
		minX,
		minY,
		targetWidth,
		targetHeight
	);

	return createCanvas$2([targetWidth, targetHeight], (ctx) =>
		ctx.putImageData(trimmedImageData, 0, 0)
	);
}

function interpolateValue(from, to, percentage) {
    return from + (to - from) * percentage;
}

class Angle {
    constructor(_degrees) {
        this._degrees = _degrees;
    }
    ;
    get degrees() {
        return this._degrees;
    }
    get radians() {
        return Angle.degreesToRadians(this._degrees);
    }
    get gradians() {
        return Angle.degreesToGradians(this._degrees);
    }
    get turns() {
        return Angle.degreesToTurns(this._degrees);
    }
    static degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    static degreesToGradians(degrees) {
        return degrees * (10 / 9);
    }
    static degreesToTurns(degrees) {
        return degrees / 360;
    }
    static radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }
    static radiansToGradians(radians) {
        return radians * (200 / Math.PI);
    }
    static radiansToTurns(radians) {
        return radians * (Math.PI / 2);
    }
    static gradiansToDegrees(gradians) {
        return gradians * 0.9;
    }
    static gradiansToRadians(gradians) {
        return gradians * (Math.PI / 200);
    }
    static gradiansToTurns(gradians) {
        return gradians / 400;
    }
    static turnsToDegrees(turns) {
        return turns * 360;
    }
    static turnsToRadians(turns) {
        return turns * (2 * Math.PI);
    }
    static turnsToGradians(turns) {
        return turns * 400;
    }
    static fromDegrees(degrees) {
        return new Angle(degrees);
    }
    static fromRadians(radians) {
        return new Angle(Angle.radiansToDegrees(radians));
    }
    static fromGradians(gradians) {
        return new Angle(Angle.gradiansToRadians(gradians));
    }
    static fromTurns(turns) {
        return new Angle(Angle.turnsToDegrees(turns));
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get coordinates() {
        return [this.x, this.y];
    }
    isSameAs(point) {
        if (point.x === this.x && point.y === this.y) {
            return true;
        }
        else {
            return false;
        }
    }
    rotate(pivot, angleOrRadians) {
        const dx = this.x - pivot.x;
        const dy = this.y - pivot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angleValue = angleOrRadians instanceof Angle ? angleOrRadians.radians : angleOrRadians;
        const radians = angleValue + Math.atan2(dy, dx);
        return new Point(pivot.x + distance * Math.cos(radians), pivot.y + distance * Math.sin(radians));
    }
    translate(x, y) {
        return new Point(this.x + x, this.y + y);
    }
    distanceTo(point) {
        return Point.distanceBetween(this, point);
    }
    liesOnSegment(segment, epsilon = 0.01) {
        return this.distanceFromSegment(segment) < epsilon;
    }
    distanceFromSegment(segment) {
        const { p1, p2 } = segment;
        return Math.abs((p2.y - p1.y) * this.x
            - (p2.x - p1.x) * this.y
            + (p2.x * p1.y)
            - (p2.y * p1.x)) / Math.sqrt(segment.length);
    }
    static distanceBetween(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }
    static fromMidpoint(p1, p2) {
        return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    }
    static fromPointlike(point) {
        if (point instanceof Point) {
            return point;
        }
        else {
            return new Point(point.x, point.y);
        }
    }
    static interpolate(p1, p2, percentage = 0.5) {
        return new Point(interpolateValue(p1.x, p2.x, percentage), interpolateValue(p1.y, p2.y, percentage));
    }
}

class Line {
    constructor(p1, p2) {
        this.p1 = Point.fromPointlike(p1);
        this.p2 = Point.fromPointlike(p2);
    }
    get points() {
        return [this.p1, this.p2];
    }
    get length() {
        return Point.distanceBetween(this.p1, this.p2);
    }
    get midpoint() {
        return this.pointAt(0.5);
    }
    translate(x, y) {
        return new Line(this.p1.translate(x, y), this.p2.translate(x, y));
    }
    pointAt(percentage = 0.5) {
        return Point.interpolate(this.p1, this.p2, percentage);
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get angle() {
        return Angle.fromRadians(Math.atan2(this.y, this.x));
    }
    static dotProduct(vector1, vector2) {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }
    static fromPoints(p1, p2) {
        return new Vector(p2.x - p1.x, p2.y - p1.y);
    }
}

class Rectangle {
    constructor(p1, p2, p3, p4) {
        this.p1 = Point.fromPointlike(p1);
        this.p2 = Point.fromPointlike(p2);
        this.p3 = Point.fromPointlike(p3);
        this.p4 = Point.fromPointlike(p4);
    }
    get width() {
        return new Line(this.p1, this.p2).length;
    }
    get height() {
        return new Line(this.p2, this.p3).length;
    }
    get diagonal() {
        return new Line(this.p1, this.p3);
    }
    get center() {
        return this.diagonal.midpoint;
    }
    get points() {
        return [this.p1, this.p2, this.p3, this.p4];
    }
    get bounds() {
        const pointX = this.points.map((point) => point.x);
        const pointY = this.points.map((point) => point.y);
        return {
            minX: Math.min(...pointX),
            maxX: Math.max(...pointX),
            minY: Math.min(...pointY),
            maxY: Math.max(...pointY)
        };
    }
    get boundingBox() {
        const { minX, maxX, minY, maxY } = this.bounds;
        return Rectangle.fromOriginAndDimensions(new Point(minX, minY), {
            width: maxX - minX,
            height: maxY - minY,
        });
    }
    translate(x, y) {
        const [p1, p2, p3, p4] = this.points.map((point) => point.translate(x, y));
        return new Rectangle(p1, p2, p3, p4);
    }
    rotate(angle, pivot) {
        const [p1, p2, p3, p4] = this.points.map((point) => point.rotate(pivot || this.center, angle));
        return new Rectangle(p1, p2, p3, p4);
    }
    containsPoint(point) {
        const am = Vector.fromPoints(this.p1, point);
        const ab = Vector.fromPoints(this.p1, this.p2);
        const ad = Vector.fromPoints(this.p1, this.p4);
        const amab = Vector.dotProduct(am, ab);
        const abab = Vector.dotProduct(ab, ab);
        const amad = Vector.dotProduct(am, ad);
        const adad = Vector.dotProduct(ad, ad);
        return (0 < amab && amab < abab) && (0 < amad && amad < adad);
    }
    intersectsWith(other) {
        return other.points.some(point => this.containsPoint(point));
    }
    static fromOriginAndDimensions(origin, dimensions) {
        const { x, y } = origin;
        const { width, height } = dimensions;
        return new Rectangle(new Point(x, y), new Point(x + width, y), new Point(x + width, y + height), new Point(x, y + height));
    }
}

function rotateCanvas(canvas, angle) {
	const angleRadians =
		angle instanceof Angle ? angle.radians : Angle.fromDegrees(angle).radians;
	const canvasRectangle = Rectangle.fromOriginAndDimensions(
		new Point(0, 0),
		canvas
	);
	const rotatedBoundingBox = canvasRectangle.rotate(angleRadians).boundingBox;
	const width = Math.round(rotatedBoundingBox.width),
		height = Math.round(rotatedBoundingBox.height);
	return createCanvas$2({ width, height }, (ctx) => {
		ctx.translate(width / 2, height / 2);
		ctx.rotate(angleRadians);
		ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
	});
}

function flipCanvas(canvas) {
	return createCanvas$2(canvas, (ctx) => {
		ctx.translate(canvas.width, 0);
		ctx.scale(-1, 1);
		ctx.drawImage(canvas, 0, 0);
	});
}

function getImageData(
	canvas,
	x = 0,
	y = 0,
	width = canvas.width,
	height = canvas.height
) {
	const targetCanvas =
		canvas instanceof canvasConstructor$1 ? canvas : copyCanvas(canvas);
	const ctx = targetCanvas.getContext('2d');
	return ctx.getImageData(x, y, width, height);
}

class ImageDataHandle {
	#rawImageData;
	constructor(rawImageData) {
		this.#rawImageData = rawImageData;
	}
	get raw() {
		return this.#rawImageData;
	}
	get data() {
		return this.raw.data;
	}
	get width() {
		return this.raw.width;
	}
	get height() {
		return this.raw.width;
	}
	_position(x, y) {
		return y * this.width * 4 + x * 4;
	}
	pixelAt(x, y) {
		const start = y * this.width * 4 + x * 4;
		return this.data.slice(start, start + 4);
	}
	componentAt(x, y, component = 'r') {
		const base = y * this.width * 4 + x * 4;
		switch (component) {
			case 'r':
				return this.data[base];
			case 'g':
				return this.data[base + 1];
			case 'b':
				return this.data[base + 2];
			case 'a':
				return this.data[base + 3];
			default:
				throw new Error(`Invalid RGBA component "${component}"`);
		}
	}
	isTransparentAt(x, y) {
		return this.componentAt(x, y, 'a') < 255;
	}
	isOpaqueAt(x, y) {
		return this.componentAt(x, y, 'a') > 0;
	}
	hasNeighbor(x, y, predicate) {
		for (let oy = -1; oy <= 1; oy++) {
			for (let ox = -1; ox <= 1; ox++) {
				if (predicate(this.pixelAt(x + ox, y + oy))) {
					return true;
				}
			}
		}
		return false;
	}
	hasTransparentNeighbor(x, y) {
		return this.hasNeighbor(x, y, ([, , , a]) => a > 0);
	}
	forEachPixel(callback) {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const position = [y * this.width * 4 + x * 4];
				const pixel = this.data.slice(position, position + 4);
				callback(pixel, x, y, position);
			}
		}
	}
	forEachCoordinate(callback) {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				callback(x, y);
			}
		}
	}
	mapPixels(callback) {
		const data = new Uint8ClampedArray(this.data.length);
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const position = y * this.width * 4 + x * 4;
				const pixel = this.data.slice(position, position + 4);
				const newPixel = callback(pixel, x, y, position);
				for (let i = 0; i <= 3; i++) {
					data[position + i] = newPixel[i];
				}
			}
		}
		return data;
	}
	static fromImage(image, width = image.width, height = image.height) {
		return new ImageDataHandle(
			getImageData(
				createCanvas$2({ width, height }, (ctx) =>
					ctx.drawImage(image, 0, 0, width, height)
				)
			)
		);
	}
}

function adjustCanvas(canvas, adjustment) {
	return createCanvas$2(canvas, (ctx) => {
    const imageData = ImageDataHandle.fromImage(canvas);
    const adjustedImageData = createImageData$1(imageData.mapPixels(adjustment), canvas.width);
    ctx.putImageData(adjustedImageData, 0, 0);
  });
}

const createCirclePath = (ctx, x, y, radius) => {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
};

const fillCircle = (ctx, x, y, radius) => {
	createCirclePath(ctx, x, y, radius);
	ctx.fill();
};

const strokeCircle = (ctx, x, y, radius) => {
	createCirclePath(ctx, x, y, radius);
	ctx.stroke();
};

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

const fillPolygon = (ctx, [...points]) => {
  createPolygonPath(ctx, points);
  ctx.fill();
};

const strokePolygon = (ctx, [...points]) => {
  createPolygonPath(ctx, points);
  ctx.stroke();
};

const fillImage = (ctx, image, x, y, width, height) =>
	ctx.drawImage(
		createCanvas$2(ctx.canvas, (tempCtx) => {
			tempCtx.fillStyle = ctx.fillStyle;
			tempCtx.drawImage(image, x, y, width, height);
			tempCtx.globalCompositeOperation = 'source-atop';
			tempCtx.fillRect(x, y, width, height);
		}),
		0,
		0
	);

const strokeImage = (
	ctx,
	image,
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
      fillCircle(
        ctx,
        targetX + x + 0.5,
        targetY + y + 0.5,
        radius - 0.5
      );
    }
  });
  ctx.restore();
};

class Canvas {
	#canvas;
	constructor(canvas) {
		this.#canvas = canvas;
	}
	get canvas() {
		return this.#canvas;
	}
	get ctx() {
		return this.canvas.getContext('2d');
	}
	draw(draw) {
		draw(this.ctx, this.canvas);
		return this;
	}
	copy() {
		return new Canvas(copyCanvas(this.canvas));
	}
	crop(ratio = '1:1') {
		this.#canvas = cropCanvas(this.canvas, ratio);
		return this;
	}
	resize(options = {}) {
		this.#canvas = resizeCanvas(this.canvas, options);
		return this;
	}
	trim() {
		this.#canvas = trimCanvas(this.canvas);
		return this;
	}
	rotate(angle) {
		this.#canvas = rotateCanvas(this.canvas, angle);
		return this;
	}
	adjust(adjustment) {
		this.#canvas = adjustCanvas(this.canvas, adjustment);
		return this;
	}
	grayscale() {
		return this.adjust(([r, g, b, a]) => {
			const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;
			return [grayscale, grayscale, grayscale, a];
		});
	}
	sepia() {
		return this.adjust(([r, g, b, a]) => {
			return [
				0.393 * r + 0.769 * g + 0.189 * b,
				0.349 * r + 0.686 * g + 0.168 * b,
				0.272 * r + 0.534 * g + 0.131 * b,
				a,
			];
		});
	}
	getImageData() {
		return getImageData(this.#canvas);
	}
	toElement() {
		return this.canvas;
	}
	toCanvas() {
		return this.canvas;
	}
	static fromCopy(canvas) {
		return new Canvas(copyCanvas(canvas));
	}
	static fromImage(image) {
		return Canvas.fromCopy(image);
	}
	static create(dimensions) {
		return new Canvas(createCanvas$2(dimensions));
	}
}

export { Canvas, ImageDataHandle, adjustCanvas, copyCanvas, createCanvas$2 as createCanvas, cropCanvas, fillCircle, fillImage, fillPolygon, flipCanvas, getImageData, loadImage$1 as loadImage, resizeCanvas, rotateCanvas, setCanvasImplementation, strokeCircle, strokeImage, strokePolygon, trimCanvas };
//# sourceMappingURL=bundle.js.map
