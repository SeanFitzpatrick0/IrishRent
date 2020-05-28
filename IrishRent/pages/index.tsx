import { GetStaticProps } from "next";
import Container from "@material-ui/core/Container";
import RentData from "../lib/RentData/RentData";
import Layout from "../components/Layout/Layout";
import Hero from "../components/Hero";
import About from "../components/About";

export default function Home({ locations, countyPrices }) {
	return (
		<>
			<Layout locations={locations}>
				<Container>
					<Hero countyPrices={countyPrices} />
					<About />
				</Container>
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
