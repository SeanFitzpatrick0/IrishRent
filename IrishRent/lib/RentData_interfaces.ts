export interface RentDataContent {
	County: LocationData;
	PostCode: LocationData;
	Town: LocationData;
}

export interface LocationData {
	[key: string]: {
		location: Location;
		priceData: {
			[key: string]: PriceRecord
		}
	}
}

export interface Location {
	locationType: string;
	county: string;
	postcode: string;
	town: string;
}

export interface PriceRecord {
	propertyType: string;
	beds: string;
	prices: {
		[key: string]: number;
	}
}
