import { browser } from '$app/environment';

export function createOSMQueryUrl(query: string) {
	return `https://osm-nominatim.gs.mil/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=5&countrycodes=us`;
}

export interface Place {
	lat: string;
	lon: string;
	name: string;
	display_name: string;
}

export async function searchForPlaces(query: string): Promise<Place[]> {
	if (!browser) {
		return new Promise(() => undefined);
	}

	const response = await fetch(createOSMQueryUrl(query));

	const json = await response.json();

	return json as Place[];
}
