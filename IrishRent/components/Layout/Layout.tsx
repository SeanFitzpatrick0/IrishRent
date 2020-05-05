import Header from "./Header";
import Footer from "./Footer";
import Container from "@material-ui/core/Container";
import { makeStyles, StylesProvider } from "@material-ui/core/styles";

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

export default function Layout({ locations, children }) {
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
