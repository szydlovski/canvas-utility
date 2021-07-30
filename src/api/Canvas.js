import { createCanvas } from './createCanvas.js';
import { resizeCanvas } from './resizeCanvas.js';
import { copyCanvas } from './copyCanvas.js';
import { cropCanvas } from './cropCanvas.js';
import { trimCanvas } from './trimCanvas.js';
import { rotateCanvas } from './rotateCanvas.js';

export class Canvas {
  #canvas;
  #ctx;
  constructor(canvas) {
    this.#canvas = canvas;
    this.#ctx = canvas.getContext('2d');
  }
  get canvas() {
    return this.#canvas;
  }
  get ctx() {
    return this.#ctx;
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
}