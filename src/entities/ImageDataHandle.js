import { createCanvas } from '../canvas-ops/createCanvas';
import { getImageData } from '../canvas-ops/getImageData';

export class ImageDataHandle {
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
				createCanvas({ width, height }, (ctx) =>
					ctx.drawImage(image, 0, 0, width, height)
				)
			)
		);
	}
}
