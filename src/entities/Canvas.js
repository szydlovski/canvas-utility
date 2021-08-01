import { createCanvas } from '../canvas-ops/createCanvas.js';
import { resizeCanvas } from '../canvas-ops/resizeCanvas.js';
import { copyCanvas } from '../canvas-ops/copyCanvas.js';
import { cropCanvas } from '../canvas-ops/cropCanvas.js';
import { trimCanvas } from '../canvas-ops/trimCanvas.js';
import { adjustCanvas } from '../canvas-ops/adjustCanvas.js';
import { rotateCanvas } from '../canvas-ops/rotateCanvas.js';
import { getImageData } from '../canvas-ops/getImageData.js';

export class Canvas {
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
		return new Canvas(createCanvas(dimensions));
	}
}
