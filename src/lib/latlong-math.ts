export function latLongToGlobeCoords(lat: number, long: number): [number, number, number] {
	const fwdX = Math.cos(long);
	const fwdY = Math.sin(long);
	const resultZ = Math.sin(lat);
	const resultX = Math.cos(lat) * fwdX;
	const resultY = Math.cos(lat) * fwdY;

	return [resultX, resultY, resultZ];
}
