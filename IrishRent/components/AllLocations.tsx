import Link from "next/link";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
import { Location } from "../lib/RentData/RentData_interfaces";
import { getLocationName } from "../lib/Utils";

// Style Definitions
const useStyles = makeStyles((theme) => ({
	wrapper: { paddingTop: theme.spacing(4), paddingBottom: theme.spacing(15) },
	panels: { marginTop: theme.spacing(3) },
	locationLinks: {
		display: "flex",
		justifyContent: "center",
		flexWrap: "wrap",
		"& > *": { margin: theme.spacing(0.5) },
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		flexBasis: "33.33%",
		flexShrink: 0,
	},
	secondaryHeading: {
		fontSize: theme.typography.pxToRem(15),
		color: theme.palette.text.secondary,
	},
	emphasizedExpand: { marginBottom: theme.spacing(2) },
}));

export default function AllLocations({ locations }) {
	// Styles
	const classes = useStyles();

	// State
	const allCounties = {
		title: "Counties",
		subtitle: "view all counties",
		locations: locations.counties,
		type: "County",
	};
	const allPostCodes = {
		title: "Post Codes",
		subtitle: "view all Dublin post codes",
		locations: locations.postcodes,
		type: "PostCode",
	};
	const groupedCounties = _.groupBy(locations.towns, (town) => town.county);
	const townsInCounties = Object.entries(groupedCounties).map(
		([county, towns]: [string, Location[]]) => ({
			title: county,
			subtitle: `view all towns in ${county}`,
			locations: towns,
			type: "Town",
		})
	);
	const sections = [allCounties, allPostCodes, ...townsInCounties];

	return (
		<Container maxWidth="md" className={classes.wrapper}>
			<Typography
				component="h1"
				variant="h4"
				align="center"
				color="textSecondary"
				gutterBottom
			>
				View all locations
			</Typography>

			<Typography
				variant="subtitle1"
				align="center"
				color="textSecondary"
			>
				View all locations in each county or search for a location using
				search bar.
			</Typography>

			<div className={classes.panels}>
				{sections.map((section, i) => {
					const panelId = "panel" + i;
					const emphasized =
						section.type === "County" ||
						section.type === "PostCode";
					return (
						<ExpansionPanel
							className={
								emphasized ? classes.emphasizedExpand : ""
							}
							key={panelId}
						>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls={`${panelId}-content`}
								id={`${panelId}-header`}
							>
								<Typography className={classes.heading}>
									{emphasized ? (
										<b>{section.title}</b>
									) : (
										section.title
									)}
								</Typography>
								<Typography
									className={classes.secondaryHeading}
								>
									{section.subtitle}
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<div className={classes.locationLinks}>
									{section.locations.map((location, i) => (
										<Link
											key={i}
											href={`/location/${getLocationName(
												location
											)}`}
										>
											<Chip
												key={i}
												label={getLocationName(
													location
												)}
												component="a"
												clickable
											/>
										</Link>
									))}
								</div>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					);
				})}
			</div>
		</Container>
	);
}
