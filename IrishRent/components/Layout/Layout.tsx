import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Header from "./Header";
import Footer from "./Footer";
import { AllLocationsRecord } from "../../lib/RentData/RentData_interfaces";

const useStyles = makeStyles((theme) => ({
	page: {
		display: "flex",
		flexFlow: "column",
		height: "100vh",
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
	const classes = useStyles();
	return (
		<div className={classes.page}>
			<Header locations={locations} />
			<main className={classes.main}>{children}</main>
			<Footer />
		</div>
	);
}
