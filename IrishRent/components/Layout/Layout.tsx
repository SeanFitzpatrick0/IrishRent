import { initGA, logPageView } from "../../lib/Analytics";

import { AllLocationsRecord } from "../../lib/RentData/types";
import Footer from "./Footer";
import Header from "./Header";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
	page: {
		display: "flex",
		flexFlow: "column",
		minHeight: "100vh",
	},
	main: { display: "flex", flexGrow: 1, width: "100%" },
}));

export default function Layout({
	locations,
	children,
}: {
	locations: AllLocationsRecord;
	children: React.ReactNode;
}) {
	// Styles
	const classes = useStyles();

	useEffect(() => {
		// Google Analytics
		initGA();
		logPageView();
	}, []);

	return (
		<div className={classes.page}>
			<Header locations={locations} />
			<main className={classes.main}>{children}</main>
			<Footer />
		</div>
	);
}
