import { GetStaticProps, GetStaticPaths } from "next";
import React, { useRef, useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Layout from "../../components/Layout/Layout";
import LocationDetails from "../../components/LocationDetails";
import RentDetails from "../../components/RentDetails";
import RentData from "../../lib/RentData/RentData";
import { getLocationName } from "../../lib/Utils";

// Styles definition
const useStyles = makeStyles((theme) => ({
	withSidebar: { display: "inherit" },
}));

export default function Location({
	locationData,
	comparisons,
	locations,
	detailsOptions,
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

	return (
		<Layout locations={locations}>
			<div
				ref={container}
				className={onLargeScreen ? classes.withSidebar : null}
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
					onLargeScreen={onLargeScreen}
					containerHeight={height}
				/>
			</div>
		</Layout>
	);
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

	return { props: { locationData, comparisons, locations, detailsOptions } };
};
