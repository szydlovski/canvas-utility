import { createCanvas } from '../canvas-ops/createCanvas';
import { getImageData } from '../canvas-ops/getImageData';
import { Drawable, PixelWithOrWithoutAlpha, RGBAComponent, RGBAPixel } from '../types';



export class ImageDataHandle {
	#rawImageData;
	constructor(rawImageData: ImageData) {
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
		return this.raw.height;
	}
	extractPixels<T extends boolean>(alpha: T): PixelWithOrWithoutAlpha<T>[] {
		return this.mapEachPixel(([r,g,b,a]) => alpha ? [r,g,b,a] : [r,g,b]) as PixelWithOrWithoutAlpha<T>[];
	}
	mapEachPixel<T>(callback: (pixel: RGBAPixel) => T): T[] {
		const mapped: T[] = [];
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const position = y * this.width * 4 + x * 4;
				const [r,g,b,a] = this.data.slice(position, position + 4);
				mapped.push(callback([r,g,b,a]));
			}
		}
		return mapped;
	}
	_position(x: number, y: number) {
		return y * this.width * 4 + x * 4;
	}
	pixelAt(x: number, y: number): RGBAPixel {
		if ([x, y].some((n) => n < 0) || x >= this.width || y >= this.height) {
			return [0,0,0,0];
		}
		const start = y * this.width * 4 + x * 4;
		const [r,g,b,a] = this.data.slice(start, start + 4);
		return [r,g,b,a];
	}
	componentAt(x: number, y: number, component: RGBAComponent = 'r') {
		const pixel = this.pixelAt(x, y);
		switch (component) {
			case 'r':
				return pixel[0];
			case 'g':
				return pixel[1];
			case 'b':
				return pixel[2];
			case 'a':
				return pixel[3];
			default:
				throw new Error(`Invalid RGBA component "${component}"`);
		}
	}
	isTransparentAt(x: number, y: number) {
		return this.componentAt(x, y, 'a') < 255;
	}
	isOpaqueAt(x: number, y: number) {
		return this.componentAt(x, y, 'a') > 0;
	}
	hasNeighbor(x: number, y: number, predicate: (neighbor: RGBAPixel) => boolean) {
		for (let oy = -1; oy <= 1; oy++) {
			for (let ox = -1; ox <= 1; ox++) {
				if (predicate(this.pixelAt(x + ox, y + oy))) {
					return true;
				}
			}
		}
		return false;
	}
	hasTransparentNeighbor(x: number, y: number) {
		return this.hasNeighbor(x, y, ([, , , a]: RGBAPixel) => a > 0);
	}
	forEachPixel(callback: (pixel: RGBAPixel, x: number, y: number, position: number) => void) {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const position = y * this.width * 4 + x * 4;
				const [r,g,b,a] = this.data.slice(position, position + 4);
				callback([r,g,b,a], x, y, position);
			}
		}
	}
	forEachCoordinate(callback: (x: number, y: number) => void) {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				callback(x, y);
			}
		}
	}
	mapPixels(callback: (pixel: RGBAPixel, x: number, y: number, position: number) => RGBAPixel) {
		const data = new Uint8ClampedArray(this.data.length);
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const position = y * this.width * 4 + x * 4;
				const [r,g,b,a] = this.data.slice(position, position + 4);
				const newPixel = callback([r,g,b,a], x, y, position);
				for (let i = 0; i <= 3; i++) {
					data[position + i] = newPixel[i];
				}
			}
		}
		return data;
	}
	static fromImage(image: Drawable, width = image.width, height = image.height) {
		return new ImageDataHandle(
			getImageData(
				createCanvas({ width, height }, (ctx) =>
					ctx.drawImage(image, 0, 0, width, height)
				)
			)
		);
	}
}
