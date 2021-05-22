import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";
import React, { useRef, useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Layout from "../../components/Layout/Layout";
import LocationDetails from "../../components/LocationDetails";
import RentDetails from "../../components/RentDetails";
import RentData from "../../lib/RentData/RentData";
import {
	LocationData,
	QuarterPeriod,
} from "../../lib/RentData/RentData_interfaces";
import {
	getLocationName,
	getAveragePrice,
	getRentChange,
} from "../../lib/Utils";

// Styles definition
const useStyles = makeStyles((theme) => ({
	container: { margin: "auto", width: "100%" },
	withSidebar: { display: "inherit" },
}));

export default function LocationPage({
	locationData,
	comparisons,
	locations,
	detailsOptions,
	currentPeriod,
}) {
	// Styles
	const classes = useStyles();

	// State
	/* Is on large screen ? */
	const theme = useTheme();
	const onLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
	/* Height of details container on desktop */
	const container = useRef(null);
	const [height, setHeight] = useState(null);
	const setContainerHeight = () => {
		const heightOfSide =
			window.innerHeight -
			(container.current?.getBoundingClientRect().top || 0);
		setHeight(heightOfSide);
	};
	useEffect(() => {
		/* update height on resize */
		setContainerHeight();
		window.addEventListener("resize", setContainerHeight);
	}, []);

	const pageTitle = getPageTitle(locationData, currentPeriod);
	const pageDescription = getPageDescription(
		locationData,
		comparisons,
		currentPeriod
	);
	const pageImage = locationData.details.image;

	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<meta name="description" content={pageDescription} />

				<meta property="og:title" content={pageTitle} key="ogtitle" />
				<meta
					property="og:description"
					content={pageDescription}
					key="ogdesc"
				/>
				<meta
					property="og:image"
					content={`/images/location_images/${pageImage}`}
					key="ogimage"
				/>
			</Head>

			<Layout locations={locations}>
				<div
					ref={container}
					className={`${onLargeScreen ? classes.withSidebar : ""} ${
						classes.container
					}`}
				>
					<LocationDetails
						locationName={getLocationName(locationData.location)}
						locationDetails={locationData.details}
						onLargeScreen={onLargeScreen}
						containerHeight={height}
					/>
					<RentDetails
						locationName={getLocationName(locationData.location)}
						locationData={locationData}
						comparisons={comparisons}
						detailsOptions={detailsOptions}
						currentPeriod={currentPeriod}
						onLargeScreen={onLargeScreen}
						containerHeight={height}
					/>
				</div>
			</Layout>
		</>
	);
}

function getPageTitle(
	locationData: LocationData,
	currentPeriod: QuarterPeriod
): string {
	const locationName = getLocationName(locationData.location);
	const { year, quarter } = currentPeriod;
	const averagePrice = getAveragePrice(
		locationData,
		"Any",
		"Any",
		year,
		quarter
	);
	let title = `Rent in ${locationName}`;
	/* add average price */
	if (averagePrice)
		title += ` | Average rent price in ${locationName} is €${averagePrice}`;
	return title;
}

function getPageDescription(
	locationData: LocationData,
	comparisons,
	currentPeriod: QuarterPeriod
): string {
	const locationName = getLocationName(locationData.location);
	// TODO make year and date dynamic
	const { year, quarter } = currentPeriod;
	const averagePrice = getAveragePrice(
		locationData,
		"Any",
		"Any",
		year,
		quarter
	);
	const rentChange = getRentChange(
		locationData.priceData["Any_Any"],
		year,
		quarter,
		year - 1,
		quarter
	);
	let description = `View ${locationName} Rent Prices. `;

	/* Add average price and price movement details */
	if (averagePrice)
		description += `The average rent price in ${locationName} is €${averagePrice}`;
	if (rentChange)
		description += ` and has ${
			rentChange.hasDecreased ? "decreases" : "increased"
		} by ${rentChange.percentage} | ${
			rentChange.absolute
		} since last year. `;

	/* Add comparison locations */
	const locations = comparisons.neighbors.map((neighbor) =>
		getLocationName(neighbor.location)
	);
	if (comparisons.parent)
		locations.push(getLocationName(comparisons.parent.location));
	description += `Also view rent prices in other locations, such as ${locations.join(
		" | "
	)}.`;

	return description;
}

export const getStaticPaths: GetStaticPaths = async () => {
	const rentData = RentData.getInstance();
	const paths = rentData.getLocationPaths();
	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const rentData = RentData.getInstance();
	const locationName = params.id.toString();
	const locationData = rentData.getLocationData(locationName);
	const comparisons = rentData.getComparisonLocations(locationData.location);
	const locations = rentData.getLocations();
	const detailsOptions = {
		propertyTypes: RentData.PROPERTY_TYPES,
		bedTypes: RentData.BED_TYPES,
	};
	const currentPeriod = rentData.getCurrentPeriod();

	return {
		props: {
			locationData,
			comparisons,
			locations,
			detailsOptions,
			currentPeriod,
		},
	};
};
