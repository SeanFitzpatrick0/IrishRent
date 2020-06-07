import { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Header from "./Header";
import Footer from "./Footer";
import { AllLocationsRecord } from "../../lib/RentData/RentData_interfaces";
import { initGA, logPageView } from "../../lib/Analytics";

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
