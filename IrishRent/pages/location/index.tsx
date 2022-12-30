import AllLocations from "../../components/AllLocations";
import { AllLocationsRecord } from "../../lib/RentData/RentData_interfaces";
import { GetStaticProps } from "next";
import Head from "next/head";
import Layout from "../../components/Layout/Layout";
import RentData from "../../lib/RentData/RentData";

const PAGE_TITLE = "Irishrent.ie | All Locations";
const PAGE_DESCRIPTION =
	"View all towns and counties available on Irishrent.ie.";

const AllLocationsHead: React.FC = () => (
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
	</Head>
);

interface AllLocationsPageProps {
	locations: AllLocationsRecord;
}

const AllLocationsPage: React.FC<AllLocationsPageProps> = ({ locations }) => {
	return (
		<>
			<AllLocationsHead />
			<Layout locations={locations}>
				<AllLocations locations={locations} />
			</Layout>
		</>
	);
};

export const getStaticProps: GetStaticProps<
	AllLocationsPageProps
> = async () => {
	const rentData = RentData.getInstance();
	const locations = rentData.getLocations();
	return { props: { locations } };
};

export default AllLocationsPage;
