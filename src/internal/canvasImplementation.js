import * as browserCanvas from './browserCanvas.js';

var createCanvas = browserCanvas.createCanvas;
var loadImage = browserCanvas.loadImage;
var createImageData = browserCanvas.createImageData;

export function setCanvasImplementation(newImplementation) {
	// TODO - maybe some validation
	({ createCanvas, loadImage, createImageData } = newImplementation);
}

export { createCanvas, loadImage, createImageData };
