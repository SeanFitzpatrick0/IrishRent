import { GetStaticProps, GetStaticPaths } from "next";

export default function Location() {
	return (
		<div>
			<p>This is the location page</p>
		</div>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	let paths = [
		{
			params: {
				id: "test",
			},
		},
	];
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
