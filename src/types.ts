export type Drawable = HTMLCanvasElement | HTMLImageElement | OffscreenCanvas;

export interface Dimensions {
  width: number,
  height: number
}

export type DimensionsSource = Dimensions | [number, number] | number;

export type DrawCallback = (ctx: CanvasRenderingContext2D) => void;

export type Ratio = `${number}:${number}`;

type Last<T extends any[]> = T extends [...infer R, infer L] ? L : never;
export type SkipFirst<T extends any[]> = T extends [infer F, ...infer R] ? R : never;
export type SkipFirstParameter<T extends (...args: any[]) => any> = SkipFirst<Parameters<T>>
export type LastParameter<T extends (...args: any[]) => any> = Last<Parameters<T>>;