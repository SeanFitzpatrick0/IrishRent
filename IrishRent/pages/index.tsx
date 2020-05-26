import { GetStaticProps } from "next";
import RentData from "../lib/RentData/RentData";
import Layout from "../components/Layout/Layout";
import Hero from "../components/Hero";

export default function Home({ locations, countyPrices }) {
	return (
		<>
			<Layout locations={locations}>
				<Hero countyPrices={countyPrices} />
			</Layout>
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const rentData = RentData.getInstance();
	const locations = rentData.getLocations();
	const countyPrices = rentData.getCurrentCountiesPrices();

	return { props: { locations, countyPrices } };
};
