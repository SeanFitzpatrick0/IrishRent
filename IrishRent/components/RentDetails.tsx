import { Bar, Line } from "react-chartjs-2";
import {
	Location,
	LocationComparisons,
	LocationData,
	QuarterPeriod,
} from "../lib/RentData/types";
import React, { useState } from "react";
import {
	getLocationColor,
	getLocationName,
	getMostRecentAveragePrice,
	getRentChange,
} from "../lib/Utils";

import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Link from "next/link";
import MenuItem from "@material-ui/core/MenuItem";
import RentData from "../lib/RentData/RentData";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import green from "@material-ui/core/colors/green";
import { makeStyles } from "@material-ui/core/styles";

// Constants
const QUARTER_PER_YEAR = 4;
const MONTHS_PER_QUARTER = 3;
const NO_DATA_LABEL = "No Data";

// Styles definition
const useStyles = makeStyles((theme) => ({
	wrapper: {
		width: "100%",
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(7),
	},
	chartTile: { fontSize: 25, paddingTop: theme.spacing(3) },
	chartDescription: { margin: theme.spacing(1) },
	directionArrow: { verticalAlign: "middle" },
}));

interface PriceOptionsProps {
	detailsOptions: DetailsOptions;
	propertyType: PropertyType;
	setPropertyType: React.Dispatch<PropertyType>;
	bedType: BedType;
	setBedType: React.Dispatch<BedType>;
}

const PriceOptions: React.FC<PriceOptionsProps> = ({
	detailsOptions: { bedTypes, propertyTypes },
	propertyType,
	setPropertyType,
	bedType,
	setBedType,
}) => {
	const selectionsData = [
		{
			label: "Property Type",
			options: propertyTypes,
			help: "Filter by property type",
			value: propertyType,
			setValue: setPropertyType,
		},
		{
			label: "Beds",
			options: bedTypes,
			help: "Filter by bedrooms",
			value: bedType,
			setValue: setBedType,
		},
	];

	return (
		<div>
			<Typography
				component="h2"
				variant="h4"
				align="center"
				color="textSecondary"
				gutterBottom
			>
				I'm looking for …
			</Typography>

			<Grid container justify="center" spacing={6}>
				{selectionsData.map(
					({ help, label, options, value, setValue }) => {
						const idRoot = label.replace(/\s+/g, "-").toLowerCase();
						const labelId = idRoot + "-select-label";
						const selectId = idRoot + "-select";

						return (
							<Grid item key={label}>
								<FormControl>
									<InputLabel id={labelId}>
										{label}
									</InputLabel>

									<Select
										labelId={labelId}
										id={selectId}
										value={value}
										onChange={(e) =>
											setValue(e.target.value as any)
										}
										displayEmpty
									>
										{(options as string[]).map((value) => (
											<MenuItem key={value} value={value}>
												{value}
											</MenuItem>
										))}
									</Select>
									<FormHelperText>{help}</FormHelperText>
								</FormControl>
							</Grid>
						);
					}
				)}
			</Grid>
		</div>
	);
};

type AveragePriceBarChartProps = Pick<
	RentDetailsProps,
	"currentPeriod" | "locationName" | "locationData" | "comparisons"
> & {
	propertyType: PropertyType;
	bedsType: BedType;
};

const AveragePriceBarChart: React.FC<AveragePriceBarChartProps> = ({
	locationName,
	locationData,
	comparisons,
	propertyType,
	bedsType,
}) => {
	// Styles
	const classes = useStyles();

	// State
	const averagePrice = getMostRecentAveragePrice(
		locationData,
		propertyType,
		bedsType
	);

	const locations = [locationData, ...comparisons.neighbors];
	if (comparisons.parent) locations.unshift(comparisons.parent);

	const locationsData = locations.map((location) => {
		const label = getLocationName(location.location);
		let [borderColor, backgroundColor] = getLocationColor(
			getLocationName(location.location),
			getLocationName(locationData.location),
			comparisons.parent && getLocationName(comparisons.parent.location)
		);

		// Get price data point
		const data = [
			getMostRecentAveragePrice(location, propertyType, bedsType),
		];

		return { label, data, borderColor, backgroundColor, borderWidth: 1 };
	});

	const data = { labels: ["Average Rent"], datasets: locationsData };
	const options = {
		hover: { mode: "point" },
		scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
	};

	return (
		<div>
			<Typography
				className={classes.chartTile}
				component="h3"
				variant="h6"
				color="textSecondary"
				gutterBottom
			>
				Average Price
			</Typography>

			<Divider light />

			<Typography
				component="p"
				variant="subtitle1"
				align="center"
				color="textSecondary"
				className={classes.chartDescription}
			>
				{averagePrice ? (
					<>
						Average rent in {locationName} is{" "}
						<b>€{averagePrice.toFixed(2)}</b>
					</>
				) : (
					<>{NO_DATA_LABEL}</>
				)}
			</Typography>

			<Bar data={data} options={options} />
		</div>
	);
};

type PricesOverTimeLineChartProps = Pick<
	RentDetailsProps,
	"currentPeriod" | "locationData" | "comparisons" | "onLargeScreen"
> & {
	propertyType: PropertyType;
	bedsType: BedType;
};

const PricesOverTimeLineChart: React.FC<PricesOverTimeLineChartProps> = ({
	currentPeriod: { year, quarter },
	locationData,
	comparisons,
	propertyType,
	bedsType,
	onLargeScreen,
}) => {
	// Styles
	const classes = useStyles();

	// State
	/* get percentage & absolute increase */
	const rentChange = getRentChange(
		locationData.priceData[`${propertyType}_${bedsType}`],
		year,
		quarter,
		year - 1,
		quarter
	);
	/* direction arrow */
	const arrowIcon = rentChange?.hasDecreased ? (
		<ArrowDownwardIcon
			className={classes.directionArrow}
			style={{ color: "tomato" }}
		/>
	) : (
		<ArrowUpwardIcon
			className={classes.directionArrow}
			style={{ color: green[500] }}
		/>
	);

	/* create datasets */
	const locations = [locationData, ...comparisons.neighbors];
	if (comparisons.parent) locations.unshift(comparisons.parent);

	const locationsData = locations.map((location) => {
		const label = getLocationName(location.location);
		let [borderColor, backgroundColor] = getLocationColor(
			getLocationName(location.location),
			getLocationName(locationData.location),
			comparisons.parent && getLocationName(comparisons.parent.location)
		);

		const data = [];
		Object.entries(
			location.priceData[`${propertyType}_${bedsType}`]?.prices || {}
		).forEach(([k, v], i) => {
			// Convert Year, Quarter to date
			let [year, quarter] = k.toString().split("Q");
			let month = parseInt(quarter) * MONTHS_PER_QUARTER;
			let date = new Date(parseInt(year), month);

			// Only add one point per year on small screen
			if (onLargeScreen || i % QUARTER_PER_YEAR === 0)
				if (v) data.push({ x: date, y: v }); // Add non null data
		});

		// Sort data by date
		data.sort((first, second) => first.x - second.x);

		return { label, data, borderColor, backgroundColor, fill: "none" };
	});

	const data = {
		labels: locationsData[0].data.map((x) => x.x),
		datasets: locationsData,
	};
	const options = {
		scales: { xAxes: [{ type: "time", time: { unit: "year" } }] },
	};

	return (
		<div>
			<Typography
				className={classes.chartTile}
				component="h3"
				variant="h6"
				color="textSecondary"
				gutterBottom
			>
				Price Changes
			</Typography>

			<Divider light />

			<Typography
				component="p"
				variant="subtitle1"
				align="center"
				color="textSecondary"
				className={classes.chartDescription}
			>
				{rentChange && (
					<>
						{arrowIcon}
						<b>{rentChange.percentage}</b> |{" "}
						<b>{rentChange.absolute}</b> since last year
					</>
				)}
			</Typography>

			<Line data={{ ...data }} options={options} />
		</div>
	);
};

type LocationPageDeepLinksProps = { locationDetails: Location } & Pick<
	RentDetailsProps,
	"locationName"
>;

interface LocationsPageDeepLinkContent {
	deepLinkId: string;
	label: string;
}

/** Links to view full list of location type items on the locations page */
const LocationPageDeepLinks: React.FC<LocationPageDeepLinksProps> = ({
	locationName,
	locationDetails: { county, postcode },
}) => {
	const isCounty = locationName === county;
	const isInDublin = county === "Dublin";
	const isDublinPostCode = locationName === postcode;

	const linksContent: LocationsPageDeepLinkContent[] = [
		{
			deepLinkId: "AllCounties",
			label: "All Counties",
		},
		(isInDublin || isDublinPostCode) && {
			deepLinkId: "AllPostcodes",
			label: "Dublin Postcodes",
		},
		{
			deepLinkId: county,
			label: `Towns in ${county}`,
		},
	].filter(Boolean);

	return (
		<Grid container spacing={5} justifyContent="center">
			{linksContent.map(({ deepLinkId, label }) => (
				<Grid item>
					<Link href={`/location#${deepLinkId}`}>
						<Button variant="outlined" color="primary">
							<a>{label}</a>
						</Button>
					</Link>
				</Grid>
			))}
		</Grid>
	);
};

export type BedType = (typeof RentData.BED_TYPES)[number] | "Any";
export type PropertyType = (typeof RentData.PROPERTY_TYPES)[number] | "Any";

export interface DetailsOptions {
	propertyTypes: PropertyType[];
	bedTypes: BedType[];
}

export interface RentDetailsProps {
	locationName: string;
	locationData: LocationData;
	comparisons: LocationComparisons;
	currentPeriod: QuarterPeriod;
	detailsOptions: DetailsOptions;
	onLargeScreen: boolean;
	containerHeight: number;
}

export const RentDetails: React.FC<RentDetailsProps> = ({
	locationName,
	locationData,
	comparisons,
	currentPeriod,
	detailsOptions,
	onLargeScreen,
	containerHeight,
}) => {
	// Styles
	const classes = useStyles();

	// State
	const [propertyType, setPropertyType] = useState<PropertyType>("Any");
	const [bedsType, setBedsType] = useState<BedType>("Any");

	return (
		<div
			className={classes.wrapper}
			style={
				onLargeScreen
					? { height: containerHeight, overflowY: "scroll" }
					: {}
			}
		>
			<Container>
				<PriceOptions
					detailsOptions={detailsOptions}
					bedType={bedsType}
					setBedType={setBedsType}
					propertyType={propertyType}
					setPropertyType={setPropertyType}
				/>

				<LocationPageDeepLinks
					locationName={locationName}
					locationDetails={locationData.location}
				/>

				<AveragePriceBarChart
					currentPeriod={currentPeriod}
					locationName={locationName}
					locationData={locationData}
					comparisons={comparisons}
					propertyType={propertyType}
					bedsType={bedsType}
				/>

				<PricesOverTimeLineChart
					currentPeriod={currentPeriod}
					locationData={locationData}
					comparisons={comparisons}
					propertyType={propertyType}
					bedsType={bedsType}
					onLargeScreen={onLargeScreen}
				/>
			</Container>
		</div>
	);
};
