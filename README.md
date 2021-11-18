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

The functions can be neatly composed to create utilities:

```js
import { cropCanvas, resizeCanvas } from '@szydlovski/canvas-utility';
const resizeAndCropPreviewImage = (image) =>
	resizeCanvas(cropCanvas(image, '1:1'), { width: 250 });

// or...

import { Canvas } from '@szydlovski/canvas-utility';
const resizeAndCropPreviewImage = (image) =>
	Canvas.fromImage(image)
		.crop('1:1')
		.resize({ width: 250 })
		.toElement();
```

# Functional API

The functional API allows non-destructive, immutable operations on the canvas. Note that in addition to canvases, all the functions accept images and offscreen canvases.

## Types

- Drawable - `HTMLImageElement | HTMLCanvasElement | OffscreenCanvas`
- Dimensions - `{ width: number, height: number }`
- DimensionsSource - `Dimensions | [number, number] | number` - an object with `width` and `height` properties, a `[width, height]` tuple or a single `number` (in which case it will be used for both width and height)
- DrawCallback - `(ctx: CanvasRenderingContext2d) => void`

## `createCanvas(source, callback)`

Arguments:
- source - `DimensionsSource` - used to determine dimensions for the created canvas
- callback - `DrawCallback` - optional, allows you to immediately draw on the created canvas

Returns: `HTMLCanvasElement`, the newly created canvas
___

Creates a new canvas using the provided `dimensions`. Optionally, you can provide a callback which can be used to draw on the newly created canvas.

Example useage:

```js
const c1 = createCanvas(500) // a 500 by 500 canvas
const c2 = createCanvas([200,400]) // a 200 by 400 canvas
const c3 = createCanvas({ width: 800, height: 1600 }) // a 800 by 1600 canvas
const c4 = createCanvas(c2) // a 200 by 400 canvas
const c5 = createCanvas(c3, ctx => ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)); // a 800 by 1600 canvas, filled with black pixels
```

## `copyCanvas(canvas)`

Arguments:
- canvas - `Drawable` - the entity to be copied

Returns: `HTMLCanvasElement`, a canvas with the copied entity

___

Creates a copy of the provided `Drawable` by drawing it on a new, identically sized canvas.

Example usage:

```js
const blackRect = createCanvas(c3, ctx => ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height));
const blackRectCopy = copyCanvas(blackRect);
console.log(blackRect !== blackRectCopy); // true
```

## `trimCanvas(canvas)`

Arguments:
- canvas - `Drawable` - the entity to be trimmed

Returns: `HTMLCanvasElement`, a canvas with the trimmed entity
___

Trims the provided `Drawable` by copying its contents to a new canvas and removing empty lines of pixels.

Example usage:

```js
const imgToTrim = createCanvas(500, ctx => ctx.fillRect(100, 100, 300, 300));
const trimmedImg = trimCanvas(imgToTrim);
console.log(trimmedImg.width); // 300
console.log(trimmedImg.height); // 300
```

# Chainable Wrapper API

The entire functional API is also available in a convenient, chainable wrapper, exported as `Canvas`, with methods named the same as the functional operations but without the `Canvas` suffix (i.e. `rotateCanvas` becomes `Canvas.rotate`).

Example usage:

```js
const img = await loadImage('path/to/image.png');
const result = Canvas.fromImage(img)
	.trim()
	.resize({ width: 500 })
	.crop('1:1')
	.rotate(45)
	.grayscale()
	.toElement(); // returns a canvas element
```

# Changelog

## [2.1.0] - 2021-08-13

### Added

- `extractPixelsFromCanvas`

## [2.0.0] - 2021-08-09

Full TypeScript rewrite.

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