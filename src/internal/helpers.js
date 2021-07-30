export function clamp(value, min, max) {
  return value > max ? max : value < min ? min : value;
}

export function parseRatio(ratio) {
	const match = ratio.match(/([0-9]+):([0-9]+)/);
	if (match === null) {
		throw new Error(`Invalid ratio: ${ratio}`);
	}
	return match.slice(1).map((value) => parseInt(value));
}