export interface RentDataContent {
	County: LocationTypeData;
	PostCode: LocationTypeData;
	Town: LocationTypeData;
}

export interface CurrentCountyPrices {
	[key: string]: {
		[key: string]: {
			propertyType: string;
			beds: string;
			price: number;
		};
	};
}

export interface LocationTypeData {
	[key: string]: LocationData;
}

export interface LocationData {
	location: Location;
	priceData: {
		[key: string]: PriceRecord;
	};
	details: LocationWikiContent;
}

export interface AllLocationsRecord {
	counties: Location[];
	postcodes: Location[];
	towns: Location[];
}

export interface LocationComparisons {
	parent?: LocationData;
	neighbors: LocationData[];
}

export interface Location {
	locationType: "County" | "PostCode" | "Town";
	county: string;
	postcode: string;
	town: string;
	inMultipleCounties: boolean;
}

export interface PriceRecord {
	propertyType: "Any" | "Detached" | "Semi Detached" | "Terrace" | "Flat";
	beds: "Any" | "1" | "2" | "3" | "1-2" | "1-3" | "4+";
	prices: {
		[key: string]: number;
	};
}

export interface LocationWikiContent {
	summary: string;
	image: string;
}

export interface QuarterPeriod {
	year: number;
	quarter: number;
}
