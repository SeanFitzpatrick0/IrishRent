import Head from "next/head";
import { GetStaticProps } from "next";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";
import Link from "@material-ui/core/Link";
import RentData from "../lib/RentData/RentData";
import Layout from "../components/Layout/Layout";
import Hero from "../components/Hero";
import About from "../components/About";

const useStyles = makeStyles((theme) => ({
	message: {
		marginTop: theme.spacing(3),
		margin: "auto",
		[theme.breakpoints.up("sm")]: { width: "60%" },
	},
}));

export default function Home({ locations, countyPrices }) {
	const classes = useStyles();
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

				<meta property="og:title" content={pageTitle} key="ogtitle" />
				<meta
					property="og:description"
					content={pageDescription}
					key="ogdesc"
				/>
				<meta
					property="og:image"
					content="/images/demo/full_demo.png"
					key="ogimage"
				/>
			</Head>

			<Layout locations={locations}>
				<Container>
					<Alert
						className={classes.message}
						severity="success"
						variant="outlined"
					>
						<strong>Irishrent.ie</strong> has been updated with{" "}
						<strong>2021 Q1</strong> rent prices. View RTB Rent
						Index Report{" "}
						<Link href="https://www.rtb.ie/research/ar">here</Link>.
					</Alert>

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
