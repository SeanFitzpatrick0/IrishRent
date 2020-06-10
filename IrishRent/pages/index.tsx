import Head from "next/head";
import { GetStaticProps } from "next";
import Container from "@material-ui/core/Container";
import RentData from "../lib/RentData/RentData";
import Layout from "../components/Layout/Layout";
import Hero from "../components/Hero";
import About from "../components/About";

export default function Home({ locations, countyPrices }) {
	const pageTitle = "Irishrent.ie | View Irish Rent Prices";
	const pageDescription =
		"View rent prices for towns across Ireland. " +
		"Looking to rent a house or apartment in Dublin, Galway, Cork, Wexford or Limerick? " +
		"irishrent.ie will show you rent prices for these areas and more.";
	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<meta name="description" content={pageDescription} />
			</Head>

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
