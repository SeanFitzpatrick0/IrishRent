import { GetStaticProps, GetStaticPaths } from "next";
import RentData from "../../lib/RentData";

export default function Location() {
	return (
		<div>
			<p>This is the location page</p>
		</div>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
    const rentData = RentData.getInstance();
    const paths = rentData.getLocationPaths();
	return {
		paths,
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async (context) => {
	return {
		props: {},
	};
};
