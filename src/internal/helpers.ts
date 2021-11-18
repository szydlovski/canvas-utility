import { Ratio, RatioString, RatioTuple } from "../types";

export function clamp(value: number, min: number, max: number) {
  return value > max ? max : value < min ? min : value;
}

export function parseRatio(ratio: Ratio): RatioTuple {
	if (typeof ratio === 'string') {
		return parseRatioString(ratio);
	} else if (Array.isArray(ratio) && ratio.length === 2) {
		return ratio;
	} else {
		throw new Error(`Invalid ratio: ${ratio}`);
	}
}

export function parseRatioString(ratio: RatioString): RatioTuple {
	const match = ratio.match(/([0-9]+):([0-9]+)/);
	if (match === null) {
		throw new Error(`Invalid ratio: ${ratio}`);
	}
	const [width, height] = match.slice(1).map((value) => parseInt(value));
	return [width, height];
}