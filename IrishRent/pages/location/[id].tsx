import { GetStaticProps, GetStaticPaths } from "next";
import React from "react";
import Layout from "../../components/Layout/Layout";
import LocationDetails from "../../components/LocationDetails";
import RentData from "../../lib/RentData/RentData";

export default function Location({ locationName, locationData, locations }) {
	return (
		<Layout locations={locations}>
			<LocationDetails locationName={locationName} open={true} />
			<p>The Data</p>
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
