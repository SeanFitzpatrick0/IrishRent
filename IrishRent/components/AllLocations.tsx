import {
	AllLocationsCurrentAveragePrice,
	AllLocationsRecord,
	LocationCurrentAveragePrice,
	LocationType,
} from "../lib/RentData/types";

import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Link from "next/link";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
import { getLocationName } from "../lib/Utils";
import { makeStyles } from "@material-ui/core/styles";

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

export interface AllLocationsProps {
	locations: AllLocationsRecord;
	currentPrices: AllLocationsCurrentAveragePrice;
}

export const AllLocations: React.FC<AllLocationsProps> = ({
	locations,
	currentPrices,
}) => {
	const classes = useStyles();
	const groupedTownsInCounties = _.groupBy(
		currentPrices[LocationType.TOWN],
		(town) => town.location.county
	);

	return (
		<Container maxWidth="md" className={classes.wrapper}>
			<AllLocationsTitle />
			<div className={classes.panels}>
				<AllCountiesSectionExpansion
					locations={currentPrices[LocationType.COUNTY]}
				/>
				<AllPostCodesSectionExpansion
					locations={currentPrices[LocationType.POST_CODE]}
				/>
				{Object.entries(groupedTownsInCounties).map(
					([county, towns]: [
						string,
						LocationCurrentAveragePrice[]
					]) => (
						<CountyCodesSectionExpansion
							title={county}
							subtitle={`view all towns in ${county}`}
							locations={towns}
						/>
					)
				)}
			</div>
		</Container>
	);
};

const AllLocationsTitle: React.FC = () => (
	<>
		<Typography
			component="h1"
			variant="h4"
			align="center"
			color="textSecondary"
			gutterBottom
		>
			View all locations
		</Typography>

		<Typography variant="subtitle1" align="center" color="textSecondary">
			View all locations in each county or search for a location using
			search bar.
		</Typography>
	</>
);

const AllCountiesSectionExpansion: React.FC<
	Pick<LocationsSectionExpansionProps, "locations">
> = ({ locations }) => (
	<LocationsSectionExpansion
		title="Counties"
		subtitle="view all counties"
		locations={locations}
		emphasize
		panelId="AllCounties"
	/>
);

const AllPostCodesSectionExpansion: React.FC<
	Pick<LocationsSectionExpansionProps, "locations">
> = ({ locations }) => (
	<LocationsSectionExpansion
		title="Post Codes"
		subtitle="view all Dublin post codes"
		locations={locations}
		emphasize
		panelId="AllPostCodes"
	/>
);

const CountyCodesSectionExpansion: React.FC<
	Pick<LocationsSectionExpansionProps, "title" | "subtitle" | "locations">
> = ({ title, subtitle, locations }) => (
	<LocationsSectionExpansion
		title={title}
		subtitle={subtitle}
		locations={locations}
		panelId={title}
		emphasize={false}
	/>
);

interface LocationsSectionExpansionProps {
	title: string;
	subtitle: string;
	locations: LocationCurrentAveragePrice[];
	emphasize: boolean;
	panelId: string;
}

const LocationsSectionExpansion: React.FC<LocationsSectionExpansionProps> = ({
	title,
	subtitle,
	locations,
	emphasize,
	panelId,
}) => {
	const classes = useStyles();
	return (
		<ExpansionPanel className={emphasize ? classes.emphasizedExpand : ""}>
			<ExpansionPanelSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls={`${panelId}-content`}
				id={`${panelId}-header`}
			>
				<Typography className={classes.heading}>
					{emphasize ? <b>{title}</b> : title}
				</Typography>
				<Typography className={classes.secondaryHeading}>
					{subtitle}
				</Typography>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails>
				<LocationLinks locations={locations} />
			</ExpansionPanelDetails>
		</ExpansionPanel>
	);
};

/** Shows all locations in a section, with their price in deceasing order */
const LocationLinks: React.FC<
	Pick<LocationsSectionExpansionProps, "locations">
> = ({ locations }) => {
	const classes = useStyles();
	return (
		<div className={classes.locationLinks}>
			{locations
				// Sort descending by current price
				.sort((a, b) => (a.currentPrice < b.currentPrice ? 1 : -1))
				.map(({ location, currentPrice }, i) => (
					<Link
						key={i}
						href={`/location/${getLocationName(location)}`}
					>
						<Chip
							key={i}
							label={
								<>
									{getLocationName(location)}{" "}
									{currentPrice && (
										<>
											€
											{Math.round(
												currentPrice
											).toLocaleString("en-GB")}
										</>
									)}
								</>
							}
							component="a"
							clickable
						/>
					</Link>
				))}
		</div>
	);
};
