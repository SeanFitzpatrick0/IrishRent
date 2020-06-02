import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CountyMap from "./CountyMap";

const useStyles = makeStyles((theme) => ({
	heroWrapper: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(10),
	},
	heroSubtitle: { [theme.breakpoints.down("sm")]: { display: "none" } },
	heroButtons: { marginTop: theme.spacing(4) },
	mapContainer: { marginTop: theme.spacing(2) },
}));

export default function Hero({ countyPrices }) {
	const classes = useStyles();
	return (
		<Container maxWidth="md" className={classes.heroWrapper}>
			{/* Title */}
			<Typography
				component="h1"
				variant="h4"
				align="center"
				color="textSecondary"
				gutterBottom
			>
				View <b>Rent Prices</b> in your area
			</Typography>

			{/* Intro description */}
			<Typography
				variant="subtitle1"
				align="center"
				color="textSecondary"
				gutterBottom
			>
				<Box
					component="div"
					fontWeight={500}
					className={classes.heroSubtitle}
				>
					Looking to rent a house or apartment at the right price?
				</Box>
				Use <b>Irishrent.ie</b> to find rent prices for towns across
				Ireland to help you find the best place to rent.
			</Typography>

			{/* County Map */}
			<Grid container justify="center" className={classes.mapContainer}>
				<CountyMap countyPrices={countyPrices} />
			</Grid>

			{/* Call to action buttons */}
			<div className={classes.heroButtons}>
				<Grid container spacing={2} justify="center">
					<Grid item>
						<Link href="/location/[id]" as="/location/Dublin">
							<Button variant="contained" color="primary">
								<a>View Dublin Prices</a>
							</Button>
						</Link>
					</Grid>
					<Grid item>
						<Link href="/location">
							<Button variant="outlined" color="primary">
								<a>View locations</a>
							</Button>
						</Link>
					</Grid>
				</Grid>
			</div>
		</Container>
	);
}
