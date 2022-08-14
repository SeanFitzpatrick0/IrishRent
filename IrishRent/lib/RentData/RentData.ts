import {
	AllLocationsRecord,
	Location,
	LocationData,
	LocationTypeData,
	QuarterPeriod,
	RentDataContent,
} from "./RentData_interfaces";
import { getLocationName, selectNRandom } from "../Utils";

import fs from "fs";
import path from "path";

const NUMB_COMPARISONS = 4;

export default class RentData {
	public static PROPERTY_TYPES = [
		"Any",
		"Detached",
		"Semi Detached",
		"Terrace",
		"Flat",
	];
	public static BED_TYPES = ["Any", "1", "2", "3", "1-2", "1-3", "4+"];

	private static instance: RentData;
	private rentDataFilePath = path.join(
		process.cwd(),
		"data",
		"rent_data_2022-08-14-14-57-36.json"
	);

	private counties: LocationTypeData;
	private postcodes: LocationTypeData;
	private towns: LocationTypeData;

	private currentYear = 2022; // TODO include in data export
	private currentQuarter = 1; // TODO include in data export

	private constructor() {
		let rawRentData = fs.readFileSync(this.rentDataFilePath);
		let rentData: RentDataContent = JSON.parse(rawRentData.toString());

		this.counties = rentData.County;
		this.postcodes = rentData.PostCode;
		this.towns = rentData.Town;
	}

	static getInstance(): RentData {
		if (!RentData.instance) RentData.instance = new RentData();
		return RentData.instance;
	}

	public getCurrentPeriod(): QuarterPeriod {
		return { year: this.currentYear, quarter: this.currentQuarter };
	}

	public getLocations(): AllLocationsRecord {
		let counties: Location[] = Object.values(this.counties).map(
			(county) => county.location
		);
		let postcodes: Location[] = Object.values(this.postcodes).map(
			(postcode) => postcode.location
		);
		let towns: Location[] = Object.values(this.towns).map(
			(town) => town.location
		);

		/* Sort postcodes by number */
		postcodes.sort((a, b) =>
			a.postcode.localeCompare(b.postcode, undefined, { numeric: true })
		);

		return { counties, postcodes, towns };
	}

	public getCurrentCountiesPrices(): {
		[key: string]: {
			[key: string]: {
				propertyType: string;
				beds: string;
				price: number;
			};
		};
	} {
		let countiesPrices = {};
		for (let [countyName, county] of Object.entries(this.counties)) {
			let countyPrices = {};
			for (let [recordType, priceRecord] of Object.entries(
				county.priceData
			)) {
				countyPrices[recordType] = {
					propertyType: priceRecord.propertyType,
					beds: priceRecord.beds,
					price: priceRecord.prices[
						`${this.currentYear}Q${this.currentQuarter}`
					],
				};
			}

			countiesPrices[countyName] = countyPrices;
		}

		return countiesPrices;
	}

	public getLocationPaths(): { params: { id: string } }[] {
		const locations = this.getLocations();
		const locationPaths = Object.values(locations).map((locations) => {
			return locations.map((location) => {
				let id = getLocationName(location);
				return { params: { id } };
			});
		});

		return locationPaths.flat();
	}

	public getLocationData(locationName: string): LocationData {
		if (this.counties[locationName]) return this.counties[locationName];
		else if (this.postcodes[locationName])
			return this.postcodes[locationName];
		else if (this.towns[locationName]) return this.towns[locationName];
		else
			throw new Error(
				`ERROR: No location with name ${locationName} found.`
			);
	}

	// TODO make variables for number of comparisons
	// TODO fix bug if there isnt enough comparisons in a county (e.g. county in carlow)
	public getComparisonLocations(referenceLocation: Location): {
		parent?: LocationData;
		neighbors: LocationData[];
	} {
		if (
			referenceLocation.locationType === "Town" ||
			referenceLocation.locationType === "PostCode"
		) {
			let parent = this.counties[referenceLocation.county];
			let similarLocations = Object.values(
				referenceLocation.locationType === "Town"
					? this.towns
					: this.postcodes
			).filter(
				(location) =>
					location.location.county === referenceLocation.county &&
					getLocationName(location.location) !==
						getLocationName(referenceLocation)
			);
			let numNeighbors =
				similarLocations.length >= NUMB_COMPARISONS - 1
					? NUMB_COMPARISONS - 1
					: similarLocations.length;
			let neighbors = selectNRandom(similarLocations, numNeighbors);
			return { parent, neighbors };
		} else {
			let similarLocations = Object.values(this.counties).filter(
				(location) =>
					getLocationName(location.location) !==
					getLocationName(referenceLocation)
			);

			let numNeighbors =
				similarLocations.length >= NUMB_COMPARISONS
					? NUMB_COMPARISONS
					: similarLocations.length;
			let neighbors = selectNRandom(similarLocations, numNeighbors);
			return { neighbors };
		}
	}
}
