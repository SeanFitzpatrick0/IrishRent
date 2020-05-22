import { Bar, Line } from "react-chartjs-2";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { getLocationName } from "../lib/Utils";
import Divider from "@material-ui/core/Divider";
import green from "@material-ui/core/colors/green";
import { getRentChange, getLocationColor } from "../lib/Utils";

// Constants
const MONTHS_PER_QUARTER = 3;

// Styles definition
const useStyles = makeStyles((theme) => ({
	wrapper: {
		width: "100%",
		paddingTop: theme.spacing(3),
		paddingsBottom: theme.spacing(7),
	},
	chartTile: { fontSize: 25 },
	chartDescription: { margin: theme.spacing(1) },
	directionArrow: { verticalAlign: "middle" },
}));

export default function RentDetails({
	locationName,
	locationData,
	comparisons,
	onLargeScreen,
	containerHeight,
}) {
	const classes = useStyles();

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
				<Typography
					component="h2"
					variant="h4"
					align="center"
					color="textSecondary"
					gutterBottom
				>
					Im looking for …
				</Typography>

				<PriceFilters />

				<AveragePriceBarChart
					locationName={locationName}
					locationData={locationData}
					comparisons={comparisons}
				/>

				<PricesOverTimeLineChart
					locationData={locationData}
					comparisons={comparisons}
				/>
			</Container>
		</div>
	);
}

function PriceFilters() {
	// TODO
	return <p>[Price Filters]</p>;
}

function AveragePriceBarChart({ locationName, locationData, comparisons }) {
	const classes = useStyles();

	// TODO dont hard code these values
	const averagePrice = locationData.priceData["Any_Any"].prices["2019Q4"];

	// Create dataset for locations
	const locations = [locationData, ...comparisons.neighbors];
	if (comparisons.parent) locations.unshift(comparisons.parent);

	// Create a dataset for each location
	const locationsData = locations.map((location) => {
		const label = getLocationName(location.location);
		let [borderColor, backgroundColor] = getLocationColor(
			getLocationName(location.location),
			getLocationName(locationData.location),
			comparisons.parent && getLocationName(comparisons.parent.location)
		);

		// Get price data points
		// TODO dont hard code these values
		const data = [location.priceData["Any_Any"].prices["2019Q4"]];

		return { label, data, borderColor, backgroundColor, borderWidth: 1 };
	});

	const data = { labels: ["Average Rent"], datasets: locationsData };
	const options = { hover: { mode: "point" } };

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
				Average rent in {locationName} is{" "}
				<b>€{averagePrice.toFixed(2)}</b>
			</Typography>

			<Bar data={data} options={options} />
		</div>
	);
}

function PricesOverTimeLineChart({ locationData, comparisons }) {
	const classes = useStyles();

	// Get percentage & absolute increase
	// TODO dont hard code these values
	const [percentageChange, absoluteChange] = getRentChange(
		locationData.priceData["Any_Any"],
		2019,
		4,
		2018,
		4
	);
	const arrowIcon = absoluteChange.includes("+") ? (
		<ArrowUpwardIcon
			className={classes.directionArrow}
			style={{ color: green[500] }}
		/>
	) : (
		<ArrowDownwardIcon
			className={classes.directionArrow}
			style={{ color: "tomato" }}
		/>
	);

	const locations = [locationData, ...comparisons.neighbors];
	if (comparisons.parent) locations.unshift(comparisons.parent);

	// Create a dataset for each location
	const locationsData = locations.map((location) => {
		const label = getLocationName(location.location);
		let [borderColor, backgroundColor] = getLocationColor(
			getLocationName(location.location),
			getLocationName(locationData.location),
			comparisons.parent && getLocationName(comparisons.parent.location)
		);

		// Get price data points
		const data = [];
		Object.entries(location.priceData["Any_Any"].prices).forEach(
			([k, v]) => {
				// Convert Year, Quarter to date
				let [year, quarter] = k.toString().split("Q");
				let month = parseInt(quarter) * MONTHS_PER_QUARTER;
				let date = new Date(parseInt(year), month);

				// Add non null data
				if (v) data.push({ x: date, y: v });
			}
		);

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
				{arrowIcon}
				<b>{percentageChange}</b> | <b>{absoluteChange}</b> since last
				year
			</Typography>
			<Line data={data} options={options} />
		</div>
	);
}
