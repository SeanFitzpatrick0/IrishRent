import { GetStaticProps, GetStaticPaths } from "next";
import RentData from "../../lib/RentData/RentData";
import { fromURL } from "../../lib/Utils";

export default function Location({ locationName, locationData }) {
	return (
		<div>
			<h1>{locationName}</h1>
			<hr />
			{JSON.stringify(locationData)}
		</div>
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
	return { props: { locationName, locationData } };
};
