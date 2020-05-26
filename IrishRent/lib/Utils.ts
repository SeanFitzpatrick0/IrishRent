import green from "@material-ui/core/colors/green";
import blue from "@material-ui/core/colors/blue";
import grey from "@material-ui/core/colors/grey";
import {
	Location,
	AllLocationsRecord,
	PriceRecord,
} from "./RentData/RentData_interfaces";

export function getLocationName(location: Location): string {
	if (location.locationType === "County") return location.county;
	else if (location.locationType === "PostCode") return location.postcode;
	else {
		return location.inMultipleCounties
			? `${location.town} (${location.county})`
			: location.town;
	}
}

// TODO can replace with lodash function ???
export function chunkArray(array: any[], numChunks: number): any[] {
	/** Splits array into array of arrays of equal size */
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

export function selectNRandom(array: any[], n: number): any[] {
	/** Select N non repeating elements for the array.
	 *  (WARNING: this function should not be used for large array where n
	 *  is close to the length of the array. This function repeatedly generated random
	 *  unseen indices to select elements. This may take a long time in this case.)
	 */
	if (n < 0) throw new RangeError(`n cant be negative (${{ n }})`);
	else if (n > array.length)
		throw new RangeError(
			`n must be less than the length of the array (${{
				n,
				length: array.length,
			}})`
		);

	let result = [];
	let seenIndices = new Set();
	let selected;

	for (let i = 0; i < n; i++) {
		// Repeatedly generated random index until unseen one found
		do selected = Math.floor(Math.random() * array.length);
		while (seenIndices.has(selected));

		seenIndices.add(selected);
		result.push(array[selected]);
	}

	return result;
}

export function getRentChange(
	locationPrices: PriceRecord,
	newYear: number,
	newQuarter: number,
	oldYear: number,
	oldQuarter: number
): { percentage: string; absolute: string; hasDecreased: boolean } | undefined {
	/** Get the percentage and absolute change in rent price as strings */
	if (oldYear > newYear || (oldYear === newYear && oldQuarter > newQuarter))
		throw new Error(
			`The old time must be before the new time. (old time = ${oldYear}Q${oldQuarter}, new time = ${newYear}Q${newQuarter})`
		);

	const oldValue = locationPrices.prices[`${oldYear}Q${oldQuarter}`];
	const newValue = locationPrices.prices[`${newYear}Q${newQuarter}`];

	if (oldValue !== null && newValue !== null) {
		const absoluteDifference = newValue - oldValue;
		const percentageDifference = (absoluteDifference / oldValue) * 100;

		return {
			percentage: percentageDifference.toFixed(2) + "%",
			absolute: `${absoluteDifference >= 0 ? "+" : "-"} €${Math.abs(
				absoluteDifference
			).toFixed(2)}`,
			hasDecreased: absoluteDifference < 0,
		};
	}
}

export function getLocationColor(
	locationName: string,
	searchName: string,
	parentName: string | undefined
): [string, string] {
	/** Gets the border and background color for item in charts */
	const isSearchLocation = locationName === searchName;
	const isParentLocation = parentName && locationName === parentName;

	if (isSearchLocation) return [green[500], green[200]];
	else if (isParentLocation) return [blue[500], blue[200]];
	else return [grey[400], grey[200]];
}
