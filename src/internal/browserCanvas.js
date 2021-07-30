export function loadImage(path) {
	return new Promise((resolve) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.src = path;
	});
}

export function createCanvas(width, height) {
	return Object.assign(document.createElement('canvas'), { width, height });
}

export function createImageData(...args) {
  return new ImageData(...args);
}