import { GetStaticProps, GetStaticPaths } from "next";
import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Container from "@material-ui/core/Container";
import Layout from "../../components/Layout/Layout";
import LocationDetails from "../../components/LocationDetails";
import RentData from "../../lib/RentData/RentData";

// Styles definition
const useStyles = makeStyles((theme) => ({
	withSidebar: { display: "inherit" },
}));

export default function Location({ locationName, locationData, locations }) {
	// Styles
	const classes = useStyles();

	// State
	/* Is on large screen ? */
	const theme = useTheme();
	const onLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

	return (
		<Layout locations={locations}>
			<div className={onLargeScreen ? classes.withSidebar : null}>
				<LocationDetails
					locationName={locationName}
					locationDetails={locationData.details}
					onLargeScreen={onLargeScreen}
				/>
				<Container>
					<p>Data</p>
				</Container>
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
	const locations = rentData.getLocations();
	return { props: { locationName, locationData, locations } };
};
