import { Ratio } from "../types";

export function clamp(value: number, min: number, max: number) {
  return value > max ? max : value < min ? min : value;
}

export function parseRatio(ratio: Ratio) {
	const match = ratio.match(/([0-9]+):([0-9]+)/);
	if (match === null) {
		throw new Error(`Invalid ratio: ${ratio}`);
	}
	return match.slice(1).map((value) => parseInt(value));
}