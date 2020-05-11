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

export interface AllLocationsRecord {
	counties: Location[];
	postcodes: Location[];
	towns: Location[];
}

export interface Location {
	locationType: "County" | "PostCode" | "Town";
	county: string;
	postcode: string;
	town: string;
	inMultipleCounties: boolean;
}

export interface PriceRecord {
	propertyType: "Any" | "Detached" | "SemiDetached" | "Terrace" | "Flat";
	beds: "Any" | "1" | "2" | "3" | "1-2" | "1-3" | "4+";
	prices: {
		[key: string]: number;
	};
}
