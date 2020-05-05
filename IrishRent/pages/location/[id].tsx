import { GetStaticProps, GetStaticPaths } from "next";
import Layout from "../../components/Layout/Layout";
import RentData from "../../lib/RentData/RentData";
import { fromURL } from "../../lib/Utils";

export default function Location({ locationName, locationData, locations }) {
	return (
		<Layout locations={locations}>
			<h1>{locationName}</h1>
			<hr />
			<p>Data</p>
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
	const locationName = fromURL(params.id.toString());
	const locationData = rentData.getLocationData(locationName);
	const locations = rentData.getLocations();
	return { props: { locationName, locationData, locations } };
};
