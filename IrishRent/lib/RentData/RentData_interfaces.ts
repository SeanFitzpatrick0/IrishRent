export interface RentDataContent {
	County: LocationTypeData;
	PostCode: LocationTypeData;
	Town: LocationTypeData;
}

export interface LocationTypeData {
	[key: string]: LocationData;
}

export interface LocationData {
	location: Location;
	priceData: {
		[key: string]: PriceRecord;
	};
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
	};
}
