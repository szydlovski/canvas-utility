import { ImageDataHandle } from '../entities/ImageDataHandle.js';
import { Drawable, PixelWithOrWithoutAlpha } from '../types.js';

export function getPixelsFromCanvas<T extends boolean>(canvas: Drawable, alpha: T): PixelWithOrWithoutAlpha<T>[] {
  const imageData = ImageDataHandle.fromImage(canvas);
  return imageData.extractPixels(alpha);
}