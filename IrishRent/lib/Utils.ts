import { Location } from "./RentData/RentData_interfaces";

export function toURL(id: string): string {
	id = toTitleCase(id);
	return id.replace(" ", "-");
}

export function fromURL(url: string): string {
	let id = url.replace("-", " ");
	return toTitleCase(id);
}

export function getLocationName(location: Location): string {
	if (location.locationType === "County") return location.county;
	else if (location.locationType === "PostCode") return location.postcode;
	else return location.town;
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

export function toTitleCase(str) {
	return str
		.split(" ")
		.map((word) => word[0].toUpperCase() + word.substr(1).toLowerCase())
		.join(" ");
}
