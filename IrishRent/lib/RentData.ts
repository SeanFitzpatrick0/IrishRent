import fs from "fs";
import path from "path";

import { RentDataContent, LocationData, Location } from "./RentData_interfaces";

export default class RentData {
	/** TODO */
	private static instance: RentData;
	private dataFilePath = path.join(
		process.cwd(),
		"data",
		"rent_data_2020-04-30-16-53-53.json"
	);

	private counties: LocationData;
	private postcodes: LocationData;
	private towns: LocationData;

	private currentYear = 2019; // TODO include in data export
	private currentQuarter = 4; // TODO include in data export

	private constructor() {
		let rawRentData = fs.readFileSync(this.dataFilePath);
		let rentData: RentDataContent = JSON.parse(rawRentData.toString());

		this.counties = rentData.County;
		this.postcodes = rentData.PostCode;
		this.towns = rentData.Town;
	}

	static getInstance(): RentData {
		if (!RentData.instance) RentData.instance = new RentData();
		return RentData.instance;
	}

	/*** DATA ACCESS METHODS ***/
	public getLocations(): {
		counties: Location[];
		postcodes: Location[];
		towns: Location[];
	} {
		let counties: Location[] = Object.values(this.counties).map(
			(county) => county.location
		);
		let postcodes: Location[] = Object.values(this.postcodes).map(
			(postcode) => postcode.location
		);
		let towns: Location[] = Object.values(this.towns).map(
			(town) => town.location
		);
		return { counties, postcodes, towns };
	}

	public getCurrentCountiesPrices(): {
		[key: string]: {
			[key: string]: {
				propertyType: String;
				beds: String;
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
					price:
						priceRecord.prices[
							`${this.currentYear}Q${this.currentQuarter}`
						],
				};
			}

			countiesPrices[countyName] = countyPrices;
		}

		return countiesPrices;
	}
}
