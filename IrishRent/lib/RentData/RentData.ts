import {
	AllLocationsCurrentAveragePrice,
	AllLocationsRecord,
	CurrentCountyPrices,
	Location,
	LocationComparisons,
	LocationCurrentAveragePrice,
	LocationData,
	LocationType,
	LocationTypeData,
	QuarterPeriod,
	QuarterlyPrices,
	RentDataContent,
} from "./types";
import { getLocationName, selectNRandom } from "../Utils";

import fs from "fs";
import path from "path";

const NUMB_COMPARISONS = 4;

/** Singleton class to load and query rent data */
export default class RentData {
	public static PROPERTY_TYPES = [
		"Any",
		"Detached",
		"Semi Detached",
		"Terrace",
		"Flat",
	] as const;
	public static BED_TYPES = [
		"Any",
		"1",
		"2",
		"3",
		"1-2",
		"1-3",
		"4+",
	] as const;

	private static instance: RentData;
	private rentDataFilePath = path.join(
		process.cwd(),
		"data",
		"rent_data_2023-12-06-19-02-01.json"
	);

	private counties: LocationTypeData;
	private postcodes: LocationTypeData;
	private towns: LocationTypeData;

	private currentYear = 2023; // TODO include in data export
	private currentQuarter = 2; // TODO include in data export
	private startingYear = 2007;
	private startingQuarter = 4;

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

	private getPeriodKey({ year, quarter }: QuarterPeriod): string {
		return `${year}Q${quarter}`;
	}

	/** Get all location details without prices */
	public getAllLocationDetails(): AllLocationsRecord {
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

	/** Gets all locations, with their current average price  */
	public getAllLocationsWithCurrentAveragePrice(): AllLocationsCurrentAveragePrice {
		return {
			[LocationType.COUNTY]: this.getLocationTypesCurrentAveragePriceData(
				this.counties
			),
			[LocationType.POST_CODE]:
				this.getLocationTypesCurrentAveragePriceData(this.postcodes),
			[LocationType.TOWN]: this.getLocationTypesCurrentAveragePriceData(
				this.towns
			),
		};
	}

	private getLocationTypesCurrentAveragePriceData(
		locationTypeData: LocationTypeData
	): LocationCurrentAveragePrice[] {
		return Object.values(locationTypeData).map(
			({ location, priceData }) => ({
				location,
				currentPrice: this.getMostRecentPrice(
					priceData["Any_Any"].prices
				),
			})
		);
	}

	public getCurrentCountiesPrices(): CurrentCountyPrices {
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
		const locations = this.getAllLocationDetails();
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
	public getComparisonLocations(
		referenceLocation: Location
	): LocationComparisons {
		if (
			referenceLocation.locationType === LocationType.TOWN ||
			referenceLocation.locationType === LocationType.POST_CODE
		) {
			let parent = this.counties[referenceLocation.county];
			let similarLocations = Object.values(
				referenceLocation.locationType === LocationType.TOWN
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

	/** Gets a list of all quarter periods in the dataset from start to current */
	private getAllQuarterPeriods(): QuarterPeriod[] {
		let currentYear = this.startingYear;
		let currentQuarter = this.startingQuarter;
		const periods: QuarterPeriod[] = [];

		while (
			currentYear < this.currentYear ||
			(currentYear == this.currentYear &&
				currentQuarter <= this.currentQuarter)
		) {
			periods.push({
				year: currentYear,
				quarter: currentQuarter,
			});

			currentQuarter += 1;
			if (currentQuarter > 4) {
				currentYear += 1;
				currentQuarter = 1;
			}
		}
		return periods;
	}

	/** Gets the most recent price defined */
	private getMostRecentPrice(prices: QuarterlyPrices): number | null {
		const periods = this.getAllQuarterPeriods().reverse();
		for (const period of periods) {
			const price = prices[this.getPeriodKey(period)];
			if (price) return price;
		}
		return null;
	}
}
