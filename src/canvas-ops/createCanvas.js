import { createCanvas as canvasCreator } from '../internal/canvasImplementation.js';

const isInteger = (...values) =>
	values.every((value) => Number.isInteger(value));

export function createCanvas (source, callback) {
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
	const canvas = canvasCreator(width, height);
	const context = canvas.getContext('2d');
	if (callback) callback(context, canvas);
	return canvas;
}
