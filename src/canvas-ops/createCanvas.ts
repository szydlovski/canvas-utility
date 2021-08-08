import { createCanvas as canvasCreator } from '../internal/canvasImplementation.js';
import { Dimensions, DimensionsSource, DrawCallback } from '../types.js';

const isNumber = (...values: any[]) =>
	values.every((value) => typeof value === 'number');

const hasDimensions = (value: any): value is Dimensions => {
	return (
		typeof value === 'object' &&
		typeof value?.width === 'number' &&
		typeof value?.height === 'number'
	);
};

export function createCanvas(
	source: DimensionsSource,
	callback?: DrawCallback
) {
	let width, height;

	// object dimensions {width, height}
	// works for canvases, images etc.
	if (hasDimensions(source)) {
		({ width, height } = source);
	}
	// array dimensions [width, height]
	else if (Array.isArray(source) && isNumber(source[0], source[1])) {
		[width, height] = source;
	}
	// sinngle integer dimensions widthAndHeight
	else if (typeof source === 'number') {
		(width = source), (height = source);
	}
	// revert to default
	else {
		console.warn('No dimensions provided for createCanvas');
		(width = 100), (height = 100);
	}
	const canvas = canvasCreator(width, height);
	const context = canvas.getContext('2d')!;
	if (callback) callback(context);
	return canvas;
}
