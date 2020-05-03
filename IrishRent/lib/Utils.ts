import { Location } from "./RentData/RentData_interfaces";

export function toURL(id: string): string {
	return id.replace(" ", "-");
}

export function fromURL(url: string): string {
	return url.replace("-", " ");
}

export function getLocationName(location: Location): string {
	if (location.locationType === "County") return location.county;
	else if (location.locationType === "PostCode") return location.postcode;
	else return location.town;
}
