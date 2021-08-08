This library contains various utilities designed for working with the HTML5 Canvas. It facilitates operations like creating, copying, cropping, trimming, flipping, merging, resizing and rotating canvases.

# Usage

```
npm install @szydlovski/canvas-utility
```
Example usage using the `Canvas` wrapper:
```js
import { Canvas, loadImage } from '@szydlovski/canvas-utility';
(async () => {
	const image = await loadImage('https://source.unsplash.com/random');
	const canvas = Canvas.create([500, 500])
		.draw((ctx) => ctx.drawImage(image, 0, 0, 500, 500))
		.flip()
		.resize({ width: 800 })
		.crop('16:9')
		.rotate(90)
		.toElement();
	document.body.appendChild(canvas);
})();
```
This will result in a random image drawn at 500 by 500 pixels, flipped horizontally, resized to 800 by 800 pixels, cropped to a 16:9 ratio (800x450) and then rotated by 90 degrees. The resulting canvas will be 450 pixels wide and 800 pixels tall.

All of the operations used in this example are also exported as individual functions, so using the wrapper is completely optional:

```js
import { flipCanvas, cropCanvas, resizeCanvas, loadImage } from '@szydlovski/canvas-utility';
(async () => {
	const image = await loadImage('https://source.unsplash.com/random');
	document.body.appendChild(
		flipCanvas(cropCanvas(resizeCanvas(image, { width: 500 }), '16:9'))
	);
})();
```
This will result in a random image, resized to a width of 500 pixels (height will be calculated from the image's aspect ratio), cropped to 16:9 and flipped horizontally.

The functions can be neatly composed to quickly 

```js
import { cropCanvas, resizeCanvas } from '@szydlovski/canvas-utility';
const resizeAndCropPreviewImage = (image) =>
	resizeCanvas(cropCanvas(image, '1:1'), { width: 250 });

// or...

import { Canvas } from '@szydlovski/canvas-utility';
const resizeAndCropPreviewImage = (image) =>
	Canvas.fromImage(image).crop('1:1').resize({ width: 250 }).toElement();
```

# Changelog

## [1.2.0] - 2021-08-01

### Added

- `maskCanvas`

## [1.1.0] - 2021-08-01

### Added

- Utilities for drawing circles - `fillCircle`, `strokeCircle`
- Utilities for drawing polygons - `fillPolygon`, `strokePolygon`
- Utilities for drawing images - `fillImage`, `strokeImage`
- Wrapper for `ImageData` - `ImageDataHandle`
- Wrapper for canvas operations - `Canvas`
- `adjustCanvas`, a function which allows pixel by pixel color adjustment

## [1.0.1] - 2021-07-30

### Added

- `flipCanvas`

## [1.0.0] - 2021-07-30

### Initial release