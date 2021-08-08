export function loadImage(path: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = (err) => reject(err);
		image.src = path;
	});
}

export function createCanvas(width: number, height: number): HTMLCanvasElement {
	return Object.assign(document.createElement('canvas'), { width, height });
}

export function createImageData(...args: ConstructorParameters<typeof ImageData>) {
  return new ImageData(...args);
}

export const canvasConstructor = HTMLCanvasElement;