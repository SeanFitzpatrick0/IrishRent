import { GetStaticProps } from "next";
import Layout from "../../components/Layout/Layout";
import RentData from "../../lib/RentData/RentData";
import AllLocations from "../../components/AllLocations";

export default function ({ locations }) {
	return (
		<Layout locations={locations}>
			<AllLocations locations={locations} />
		</Layout>
	);
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const rentData = RentData.getInstance();
	const locations = rentData.getLocations();
	return { props: { locations } };
};
