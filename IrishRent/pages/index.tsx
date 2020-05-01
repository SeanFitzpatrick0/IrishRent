import { GetStaticProps } from "next";
import Header from "../components/Header";
import RentData from "../lib/RentData/RentData";

export default function Home({ locations, countyPrices }) {
	return (
		<>
			<Header />
			<div>
				<p>Locations = {JSON.stringify(locations)}</p>
				<br />
				<p>Prices = {JSON.stringify(countyPrices)}</p>
			</div>
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
