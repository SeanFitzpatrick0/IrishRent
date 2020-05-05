import { Chart } from "react-google-charts";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// Styles Definition
const useStyles = makeStyles((theme) => ({
	chartContainer: {
		display: "flex",
		justifyContent: "center",
		overflow: "hidden",
		width: '100%'
	},
	chart: {
		minWidth: "500px",
		position: "relative",
		left: "50%",
		transform: "translateX(-50%)",
	},
}));

export default function CountyMap({ countyPrices }) {
	// Styles
	const classes = useStyles();

	// State
	/* Formate data for chart */
	const chartData = formatChartData(countyPrices);
	/* Is on large screen ? */
	const theme = useTheme();
	const onLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));

	return (
		<div className={classes.chartContainer}>
			<Chart
				className={classes.chart}
				chartType="GeoChart"
				data={[["City", "Average rent price (€)"], ...chartData]}
				width="95%"
				options={{
					region: "IE",
					resolution: "provinces",
					legend: !onLargeScreen ? "none" : null,
				}}
			/>
		</div>
	);
}

function formatChartData(countyPrices) {
	let chartData = Object.entries(countyPrices).map(([countyName, prices]) => {
		/* Bug with displaying 'Cork' by name. Workaround it to use the area code and label
			https://stackoverflow.com/questions/61020311/googles-geochart-wont-display-cork-within-ireland-map */
		const countyID =
			countyName !== "Cork" ? countyName : { v: "IE-CO", f: countyName };
		return [countyID, prices["Any_Any"].price];
	});
	/* Louth hasn't published data since 2016. 
		Null value entries are removed as they create issues with the colour scale if included */
	chartData = chartData.filter(([_, price]) => price !== null);
	return chartData;
}
