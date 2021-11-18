import { createCanvas } from './createCanvas.js';
import { parseRatio } from '../internal/helpers.js';
import { Drawable, Ratio } from '../types.js';



export function cropCanvas(source: Drawable, ratio: Ratio = '1:1') {
	// extract numbers from ratio
	const [widthRatio, heightRatio] = parseRatio(ratio);
	const { width: sourceWidth, height: sourceHeight } = source;

	let targetWidth: number, targetHeight: number;
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
	return createCanvas([targetWidth, targetHeight], (ctx) => {
		// position in the center
		// TODO - add options for positioning
		const x = (targetWidth - sourceWidth) / 2;
		const y = (targetHeight - sourceHeight) / 2;
		ctx.drawImage(source, x, y);
	});
}
