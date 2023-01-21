export enum LocationType {
	COUNTY = "County",
	POST_CODE = "PostCode",
	TOWN = "Town",
}

export enum PropertyType {
	ANY = "Any",
	DETACHED = "Detached",
	SEMI_DETACHED = "Semi Detached",
	TERRACE = "Terrace",
	FLAT = "Flat",
}

export enum BedType {
	ANY = "Any",
	ONE = "1",
	TWO = "2",
	THREE = "3",
	ONE_TO_TWO = "1-2",
	ONE_TO_THREE = "1-3",
	FOUR_PLUS = "4+",
}

export type RentDataContent = Record<LocationType, LocationTypeData>;

export interface CurrentCountyPrices {
	[key: string]: {
		[key: string]: {
			propertyType: PropertyType;
			beds: BedType;
			price: number;
		};
	};
}

export type LocationCurrentAveragePrice = {
	currentPrice: number;
} & Pick<LocationData, "location">;

/** All location details, with their current average price */
export type AllLocationsCurrentAveragePrice = Record<
	LocationType,
	LocationCurrentAveragePrice[]
>;

export interface LocationTypeData {
	[locationName: string]: LocationData;
}

export interface LocationData {
	location: Location;
	priceData: Record<string, PriceRecord>;
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
	locationType: LocationType;
	county: string;
	postcode?: string;
	town?: string;
	inMultipleCounties: boolean;
}

export interface PriceRecord {
	propertyType: PropertyType;
	beds: BedType;
	prices: {
		[yearQuarter: string]: number;
	};
}

export interface LocationWikiContent {
	/** Summary text pull from wiki */
	summary: string;
	/** URL to image */
	image: string;
}

export interface QuarterPeriod {
	year: number;
	quarter: number;
}
