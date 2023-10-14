import {
	AllLocationsCurrentAveragePrice,
	LocationCurrentAveragePrice,
	LocationType,
} from "../lib/RentData/types";
import ExpansionPanel, {
	ExpansionPanelProps,
} from "@material-ui/core/ExpansionPanel";
import { Reducer, useEffect, useReducer } from "react";

import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Link from "next/link";
import Typography from "@material-ui/core/Typography";
import { getLocationName } from "../lib/Utils";
import { groupBy } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";

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
	currentPrices: AllLocationsCurrentAveragePrice;
}

type ExpandersState = {
	AllCounties: boolean;
	AllPostcodes: boolean;
	[countyName: string]: boolean;
};

type ExpandersStateActions =
	| { type: "EXPAND_ALL" }
	| { type: "COLLAPSE_ALL" }
	| {
			type: "TOGGLE_BY_ID" | "OPEN_BY_ID";
			payload: { id: keyof ExpandersState };
	  };

const expandersStateReducer: Reducer<ExpandersState, ExpandersStateActions> = (
	state,
	action
) => {
	const newState = { ...state };
	let id;
	switch (action.type) {
		case "EXPAND_ALL":
			Object.keys(newState).forEach((key) => (newState[key] = true));
			return newState;
		case "COLLAPSE_ALL":
			Object.keys(newState).forEach((key) => (newState[key] = false));
			return newState;
		case "TOGGLE_BY_ID":
			id = action.payload.id;
			newState[id] = !newState[id];
			return newState;
		case "OPEN_BY_ID":
			id = action.payload.id;
			newState[id] = true;
			return newState;
	}
};

function initializeExpandersState(
	currentPrices: AllLocationsCurrentAveragePrice,
	initialValue: boolean
): ExpandersState {
	return {
		AllCounties: false,
		AllPostcodes: false,
		...Object.fromEntries(
			currentPrices[LocationType.COUNTY].map(({ location }) => [
				location.county,
				initialValue,
			])
		),
	};
}

export const AllLocations: React.FC<AllLocationsProps> = ({
	currentPrices,
}) => {
	const { asPath } = useRouter();
	const classes = useStyles();
	const groupedTownsInCounties = groupBy(
		currentPrices[LocationType.TOWN],
		(town) => town.location.county
	);

	// State to determine which expander is open
	const [expanderState, expanderDispatch] = useReducer(
		expandersStateReducer,
		initializeExpandersState(currentPrices, false)
	);

	// Set initial expander open based on search fragment
	useEffect(() => {
		let locationFragment = asPath.split("#")[1];
		expanderDispatch({
			type: "OPEN_BY_ID",
			payload: {
				id: locationFragment,
			},
		});
	}, [asPath]);

	return (
		<Container maxWidth="md" className={classes.wrapper}>
			<AllLocationsTitle />
			<div className={classes.panels}>
				<AllCountiesSectionExpansion
					locations={currentPrices[LocationType.COUNTY]}
					expanded={expanderState.AllCounties}
					onChange={() =>
						expanderDispatch({
							type: "TOGGLE_BY_ID",
							payload: { id: "AllCounties" },
						})
					}
				/>
				<AllPostCodesSectionExpansion
					locations={currentPrices[LocationType.POST_CODE]}
					expanded={expanderState.AllPostcodes}
					onChange={() =>
						expanderDispatch({
							type: "TOGGLE_BY_ID",
							payload: { id: "AllPostcodes" },
						})
					}
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
							expanded={expanderState[county]}
							onChange={() =>
								expanderDispatch({
									type: "TOGGLE_BY_ID",
									payload: { id: county },
								})
							}
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
	Pick<LocationsSectionExpansionProps, "locations" | "expanded" | "onChange">
> = ({ locations, expanded, onChange }) => (
	<LocationsSectionExpansion
		title="Counties"
		subtitle="view all counties"
		locations={locations}
		emphasize
		panelId="AllCounties"
		expanded={expanded}
		onChange={onChange}
	/>
);

const AllPostCodesSectionExpansion: React.FC<
	Pick<LocationsSectionExpansionProps, "locations" | "expanded" | "onChange">
> = ({ locations, expanded, onChange }) => (
	<LocationsSectionExpansion
		title="Post Codes"
		subtitle="view all Dublin post codes"
		locations={locations}
		emphasize
		panelId="AllPostcodes"
		expanded={expanded}
		onChange={onChange}
	/>
);

const CountyCodesSectionExpansion: React.FC<
	Pick<
		LocationsSectionExpansionProps,
		"title" | "subtitle" | "locations" | "expanded" | "onChange"
	>
> = ({ title, subtitle, locations, expanded, onChange }) => (
	<LocationsSectionExpansion
		title={title}
		subtitle={subtitle}
		locations={locations}
		panelId={title}
		emphasize={false}
		expanded={expanded}
		onChange={onChange}
	/>
);

type LocationsSectionExpansionProps = {
	panelId: string;
	title: string;
	subtitle: string;
	locations: LocationCurrentAveragePrice[];
	emphasize: boolean;
} & Pick<ExpansionPanelProps, "expanded" | "onChange">;

const LocationsSectionExpansion: React.FC<LocationsSectionExpansionProps> = ({
	title,
	subtitle,
	locations,
	emphasize,
	panelId,
	expanded,
	onChange,
}) => {
	const classes = useStyles();
	return (
		<ExpansionPanel
			id={panelId}
			className={emphasize ? classes.emphasizedExpand : ""}
			expanded={expanded}
			onChange={onChange}
		>
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
