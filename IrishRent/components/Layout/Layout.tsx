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
	main: {
		display: "flex",
		flexGrow: 1,
	},
	content: { width: "100%" },
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
			<Container maxWidth="md" className={classes.main} component="main">
				<div className={classes.content}>{children}</div>
			</Container>
			<Footer />
		</div>
	);
}
