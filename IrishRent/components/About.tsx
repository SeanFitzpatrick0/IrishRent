import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

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
						prices for of towns and counties across Ireland.
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

					<Typography component="p" variant="body1">
						If you have any questions or feedback, please contact us
						at{" "}
						<Link href="mailto:contact@Irishrent.ie">
							contact@Irishrent.ie
						</Link>{" "}
						or submit it in the input at the bottom of the page.
					</Typography>
				</CardContent>
			</Card>
		</Container>
	);
}
