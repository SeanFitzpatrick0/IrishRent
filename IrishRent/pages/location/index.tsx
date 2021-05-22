import Head from "next/head";
import { GetStaticProps } from "next";
import Layout from "../../components/Layout/Layout";
import RentData from "../../lib/RentData/RentData";
import AllLocations from "../../components/AllLocations";

export default function ({ locations }) {
	const pageTitle = "Irishrent.ie | All Locations";
	const pageDescription =
		"View all towns and counties available on Irishrent.ie.";

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
				<AllLocations locations={locations} />
			</Layout>
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const rentData = RentData.getInstance();
	const locations = rentData.getLocations();
	return { props: { locations } };
};
