import {
	AllLocationsRecord,
	CurrentCountyPrices,
	QuarterPeriod,
} from "../lib/RentData/RentData_interfaces";

import About from "../components/About";
import Alert from "@material-ui/lab/Alert";
import Container from "@material-ui/core/Container";
import { GetStaticProps } from "next";
import Head from "next/head";
import Hero from "../components/Hero";
import Layout from "../components/Layout/Layout";
import Link from "@material-ui/core/Link";
import RentData from "../lib/RentData/RentData";
import { makeStyles } from "@material-ui/core/styles";

const PAGE_TITLE = "Irishrent.ie | View Rent Prices in Ireland";
const PAGE_DESCRIPTION =
	"View rent prices for towns across Ireland. " +
	"Looking to rent a house or apartment in Dublin, Galway, Cork, Wexford or Limerick? " +
	"irishrent.ie will show you rent prices for these areas and more.";

const useStyles = makeStyles((theme) => ({
	message: {
		marginTop: theme.spacing(3),
		margin: "auto",
		[theme.breakpoints.up("sm")]: { width: "60%" },
	},
}));

const HomeHead: React.FC = () => (
	<Head>
		<title>{PAGE_TITLE}</title>
		<meta name="description" content={PAGE_DESCRIPTION} />

		<meta property="og:title" content={PAGE_TITLE} key="ogtitle" />
		<meta
			property="og:description"
			content={PAGE_DESCRIPTION}
			key="ogdesc"
		/>
		<meta
			property="og:image"
			content="/images/demo/full_demo.png"
			key="ogimage"
		/>
		{/* TODO Pass from rent data */}
		{/* <meta itemProp="datePublished" content="2016-01-07"></meta> */}
	</Head>
);

const LastUpdateAlert: React.FC<Pick<HomeProps, "currentPeriod">> = ({
	currentPeriod: { year, quarter },
}) => {
	const classes = useStyles();
	return (
		<Alert
			className={classes.message}
			severity="success"
			variant="outlined"
		>
			<strong>Irishrent.ie</strong> has been updated with{" "}
			<strong>
				{year} Q{quarter}
			</strong>{" "}
			rent prices. View RTB Rent Index Report{" "}
			<Link href="https://www.rtb.ie/research/ar">here</Link>.
		</Alert>
	);
};

interface HomeProps {
	locations: AllLocationsRecord;
	countyPrices: CurrentCountyPrices;
	currentPeriod: QuarterPeriod;
}

const Home: React.FC<HomeProps> = ({
	locations,
	countyPrices,
	currentPeriod,
}) => {
	return (
		<>
			<HomeHead />
			<Layout locations={locations}>
				<Container>
					<LastUpdateAlert currentPeriod={currentPeriod} />
					<Hero countyPrices={countyPrices} />
					<About />
				</Container>
			</Layout>
		</>
	);
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
	const rentData = RentData.getInstance();
	const locations = rentData.getLocations();
	const countyPrices = rentData.getCurrentCountiesPrices();
	const currentPeriod = rentData.getCurrentPeriod();

	return { props: { locations, countyPrices, currentPeriod } };
};

export default Home;
