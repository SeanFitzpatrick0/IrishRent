import { Location, AllLocationsRecord } from "./RentData/RentData_interfaces";

export function getLocationName(location: Location): string {
	if (location.locationType === "County") return location.county;
	else if (location.locationType === "PostCode") return location.postcode;
	else {
		return location.inMultipleCounties
			? `${location.town} (${location.county})`
			: location.town;
	}
}

export function chunkArray(array: any[], numChunks: number): any[] {
	if (numChunks <= 0)
		throw new Error(
			`Error: numChunks must be > 0. (numChunks = ${numChunks})`
		);
	else if (numChunks > array.length)
		throw new Error(
			`Error: numChunks must be <= the array size (numChunks = ${numChunks}, array.length = ${array.length})`
		);
	let result = [];
	let chunkStart = 0;
	for (let i = 0; i < numChunks; i++) {
		let chunkSize = Math.ceil(
			(array.length - chunkStart) / (numChunks - i)
		);
		result.push(array.slice(chunkStart, chunkStart + chunkSize));
		chunkStart += chunkSize;
	}
	return result;
}

export function findLocationInRecords(
	locationName: string,
	locationRecords: AllLocationsRecord
): string | undefined {
	for (const locationType in locationRecords) {
		const typeLocations = locationRecords[locationType];
		const foundLocation = typeLocations.find(
			(location) =>
				getLocationName(location).toLowerCase() ===
				locationName.toLowerCase()
		);
		if (foundLocation) return getLocationName(foundLocation);
	}
}
