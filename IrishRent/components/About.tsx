import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	wrapper: {
		[theme.breakpoints.up("md")]: {
			marginLeft: theme.spacing(5),
			marginRight: theme.spacing(5),
		},
		marginBottom: theme.spacing(10),
	},
}));

export default function About() {
	const classes = useStyles();

	return (
		<Container id="about" maxWidth="md">
			<Card className={classes.wrapper}>
				<CardContent>
					<Typography
						component="h1"
						variant="h4"
						color="textSecondary"
						gutterBottom
					>
						About Irishrent.ie
					</Typography>

					<Typography component="p" variant="subtitle1" gutterBottom>
						Irishrent.ie allows users to view information on rent
						prices for towns and counties across Ireland.
					</Typography>

					<List>
						<ListItem>
							<ListItemIcon>
								<HelpOutlineIcon />
							</ListItemIcon>
							<ListItemText>
								Are you searching where you should rent in
								Ireland?
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<HelpOutlineIcon />
							</ListItemIcon>
							<ListItemText>
								Want to know if you are paying above average
								rent price?
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<HelpOutlineIcon />
							</ListItemIcon>
							<ListItemText>
								Want to know what is the right price to charge
								for your rental property?
							</ListItemText>
						</ListItem>
					</List>

					<br />
					<Typography component="p" variant="body1" gutterBottom>
						Simply search for your location in the search bar or
						explore all of our{" "}
						<Link href="/location">locations</Link>.
					</Typography>

					<Typography component="p" variant="body1" gutterBottom>
						The information provided by this site uses the Average
						Monthly Rent Report published by the{" "}
						<Link href="https://www.rtb.ie/">
							Residential Tenancies Board (RTB)
						</Link>
						.
					</Typography>

					<br />

					<Typography component="p" variant="body1">
						Learn more about how this site is made by visiting it's{" "}
						<Link href="https://github.com/SeanFitzpatrick0/IrishRent">
							GitHub page
						</Link>
						.
					</Typography>
				</CardContent>
			</Card>
		</Container>
	);
}
