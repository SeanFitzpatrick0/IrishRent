import { GetStaticProps } from "next";
import RentData from "../lib/RentData";

export default function Home({ locations, countyPrices }) {
	return (
		<div>
			<h1>Irish Rent</h1>
			<div>
				<p>Locations = {JSON.stringify(locations)}</p>
				<br />
				<p>Prices = {JSON.stringify(countyPrices)}</p>
			</div>
		</div>
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
