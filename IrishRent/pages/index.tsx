import { GetStaticProps } from "next";
import RentData from "../lib/RentData/RentData";
import Layout from "../components/Layout";

export default function Home({ locations, countyPrices }) {
	return (
		<>
			<Layout locations={locations}>
				<p>Content</p>
			</Layout>
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const rentData = RentData.getInstance();
	const locations = rentData.getLocations();
	const countyPrices = rentData.getCurrentCountiesPrices();

	return {
		props: {
			locations,
			countyPrices,
		},
	};
};
