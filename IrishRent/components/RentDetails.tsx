import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import green from "@material-ui/core/colors/green";
import {
	getLocationName,
	getRentChange,
	getLocationColor,
	getAveragePrice,
} from "../lib/Utils";

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
	chartTile: { fontSize: 25 },
	chartDescription: { margin: theme.spacing(1) },
	directionArrow: { verticalAlign: "middle" },
}));

export default function RentDetails({
	locationName,
	locationData,
	comparisons,
	detailsOptions,
	onLargeScreen,
	containerHeight,
}) {
	// Styles
	const classes = useStyles();

	// State
	const [propertyType, setPropertyType] = useState("Any");
	const [bedsType, setBedsType] = useState("Any");
	const optionsState = {
		propertyType: { value: propertyType, setValue: setPropertyType },
		bedsType: { value: bedsType, setValue: setBedsType },
	};

	return (
		<div
			className={classes.wrapper}
			style={
				onLargeScreen
					? { height: containerHeight, overflowY: "scroll" }
					: { height: "100%" }
			}
		>
			<Container>
				<PriceOptions
					detailsOptions={detailsOptions}
					optionsState={optionsState}
				/>

				<AveragePriceBarChart
					locationName={locationName}
					locationData={locationData}
					comparisons={comparisons}
					propertyType={propertyType}
					bedsType={bedsType}
				/>

				<PricesOverTimeLineChart
					locationData={locationData}
					comparisons={comparisons}
					propertyType={propertyType}
					bedsType={bedsType}
					onLargeScreen={onLargeScreen}
				/>
			</Container>
		</div>
	);
}

function PriceOptions({ detailsOptions, optionsState }) {
	const selectionsData = [
		{
			label: "Property Type",
			options: detailsOptions.propertyTypes,
			help: "Filter by property type",
			value: optionsState.propertyType.value,
			setValue: optionsState.propertyType.setValue,
		},
		{
			label: "Beds",
			options: detailsOptions.bedTypes,
			help: "Filter by bedrooms",
			value: optionsState.bedsType.value,
			setValue: optionsState.bedsType.setValue,
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
				{selectionsData.map((option) => {
					const idRoot = option.label
						.replace(/\s+/g, "-")
						.toLowerCase();
					const labelId = idRoot + "-select-label";
					const selectId = idRoot + "-select";

					return (
						<Grid item key={option.label}>
							<FormControl>
								<InputLabel id={labelId}>
									{option.label}
								</InputLabel>

								<Select
									labelId={labelId}
									id={selectId}
									value={option.value}
									onChange={(e) =>
										option.setValue(
											e.target.value as string
										)
									}
									displayEmpty
								>
									{option.options.map((value) => (
										<MenuItem key={value} value={value}>
											{value}
										</MenuItem>
									))}
								</Select>
								<FormHelperText>{option.help}</FormHelperText>
							</FormControl>
						</Grid>
					);
				})}
			</Grid>
		</div>
	);
}

function AveragePriceBarChart({
	locationName,
	locationData,
	comparisons,
	propertyType,
	bedsType,
}) {
	// Styles
	const classes = useStyles();

	// State
	const averagePrice = getAveragePrice(
		locationData,
		propertyType,
		bedsType,
		2019,
		4
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

		// Get price data points
		const data = [
			location.priceData[`${propertyType}_${bedsType}`].prices["2019Q4"],
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
}

function PricesOverTimeLineChart({
	locationData,
	comparisons,
	propertyType,
	bedsType,
	onLargeScreen,
}) {
	// Styles
	const classes = useStyles();

	// State
	/* get percentage & absolute increase */
	const rentChange = getRentChange(
		locationData.priceData[`${propertyType}_${bedsType}`],
		2019,
		4,
		2018,
		4
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
			location.priceData[`${propertyType}_${bedsType}`].prices
		).forEach(([k, v], i) => {
			// Convert Year, Quarter to date
			let [year, quarter] = k.toString().split("Q");
			let month = parseInt(quarter) * MONTHS_PER_QUARTER;
			let date = new Date(parseInt(year), month);

			// Only add one point per year on small screen
			if (onLargeScreen || i % QUARTER_PER_YEAR === 0)
				if (v) data.push({ x: date, y: v }); // Add non null data
		});

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
				{rentChange ? (
					<>
						{arrowIcon}
						<b>{rentChange.percentage}</b> |{" "}
						<b>{rentChange.absolute}</b> since last year
					</>
				) : (
					<>{NO_DATA_LABEL}</>
				)}
			</Typography>

			<Line data={data} options={options} />
		</div>
	);
}
