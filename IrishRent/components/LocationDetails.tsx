import React, { useEffect, useRef, useState } from "react";

import Box from "@material-ui/core/Box";
import CloseIcon from "@material-ui/icons/Close";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsBusIcon from "@material-ui/icons/DirectionsBus";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { LocationWikiContent } from "../lib/RentData/types";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import PeopleIcon from "@material-ui/icons/People";
import TramIcon from "@material-ui/icons/Tram";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

// TODO Place holder data
const DEMO_STATS = [
	{
		stats: [
			{
				Icon: PeopleIcon,
				label: "Population",
				value: "100,000",
			},
		],
	},
	{
		title: "Transport",
		stats: [
			{
				Icon: TramIcon,
				label: "On the green line",
				value: "10 minutes to city center",
			},
			{
				Icon: DirectionsBusIcon,
				label: "15, 15A, 17, 18",
				value: "15 minutes to city center",
			},
			{
				Icon: DirectionsBikeIcon,
				label: null,
				value: "20 minutes to city center",
			},
			{
				Icon: DirectionsWalkIcon,
				label: null,
				value: "25 minutes to city center",
			},
		],
	},
];

type LocationDemoStats = typeof DEMO_STATS;

// Styles definition
const useStyles = makeStyles((theme) => ({
	sidebar: {
		width: "35%",
		minWidth: 300,
		backgroundColor: theme.palette.background.paper,
		borderRight: `1.5px solid #707070`,
		overflowY: "scroll",
	},
	locationImg: {
		maxWidth: "100%",
		maxHeight: 400,
		borderRadius: "10px",
		marginBottom: theme.spacing(2),
	},
	locationTitle: {
		marginTop: theme.spacing(2),
		fontSize: "200%",
	},
	locationDescription: { marginBottom: theme.spacing(2) },
	statItem: { width: "50%" },
	closeButton: {
		position: "absolute",
		right: theme.spacing(1),
		top: theme.spacing(1),
	},
}));

const LocationDetailsDesktop: React.FC<LocationDetailsProps> = ({
	locationName,
	locationDetails: { image, summary },
	containerHeight,
}) => {
	// Styles
	const classes = useStyles();

	return (
		<div className={classes.sidebar} style={{ height: containerHeight }}>
			<Container>
				<LocationTitle locationName={locationName} />
				<LocationImage locationName={locationName} image={image} />
				<LocationSummary summary={summary} />
				{/* 
					UNCOMMENT TO ADD LOCATION STATS
					<LocationStats locationStats={DEMO_STATS} /> 
				*/}
			</Container>
		</div>
	);
};

const LocationDetailsMobile: React.FC<LocationDetailsProps> = ({
	locationName,
	locationDetails,
}) => {
	// State
	const [open, setOpen] = React.useState(false);
	const toggleOpen = () => setOpen((currentState) => !currentState);

	return (
		<Container>
			<LocationTitle locationName={locationName}>
				<IconButton onClick={toggleOpen}>
					<InfoIcon />
				</IconButton>
			</LocationTitle>
			<hr />

			<LocationDetailsDialog
				locationName={locationName}
				locationDetails={locationDetails}
				open={open}
				onClose={toggleOpen}
			/>
		</Container>
	);
};

type LocationDetailsDialogProps = Pick<
	LocationDetailsProps,
	"locationName" | "locationDetails"
> & {
	open: boolean;
	onClose: () => void;
};

const LocationDetailsDialog: React.FC<LocationDetailsDialogProps> = ({
	locationName,
	locationDetails: { image, summary },
	open,
	onClose,
}) => {
	// Styles
	const classes = useStyles();

	return (
		<Dialog
			onClose={onClose}
			aria-labelledby="location-dialog-title"
			open={open}
		>
			<MuiDialogTitle>
				<Typography component="p" variant="h6">
					{locationName}
				</Typography>
				<IconButton
					aria-label="close"
					onClick={onClose}
					className={classes.closeButton}
				>
					<CloseIcon />
				</IconButton>
			</MuiDialogTitle>

			<MuiDialogContent dividers>
				<LocationImage locationName={locationName} image={image} />
				<LocationSummary summary={summary} />

				{/* UNCOMMENT TO ADD LOCATION STATS
					<LocationStats locationStats={DEMO_STATS} /> 
				*/}
			</MuiDialogContent>
		</Dialog>
	);
};

const LocationTitle: React.FC<Pick<LocationDetailsProps, "locationName">> = ({
	locationName,
}) => {
	const classes = useStyles();
	return (
		<Typography
			component="h1"
			variant="h6"
			align="center"
			className={classes.locationTitle}
			color="textSecondary"
			gutterBottom
		>
			{locationName}
		</Typography>
	);
};

type LocationImageProps = Pick<LocationDetailsProps, "locationName"> &
	Pick<LocationWikiContent, "image">;

const LocationImage: React.FC<LocationImageProps> = ({
	locationName,
	image,
}) => {
	const classes = useStyles();
	return (
		<Box display="flex">
			<Box m="auto">
				<img
					className={classes.locationImg}
					src={`/images/location_images/${image}`}
					alt={`Rent prices in ${locationName}`}
				/>
			</Box>
		</Box>
	);
};

type LocationSummaryProps = Pick<LocationWikiContent, "summary">;

const LocationSummary: React.FC<LocationSummaryProps> = ({ summary }) => {
	const classes = useStyles();
	return (
		<Typography
			component="p"
			variant="body2"
			className={classes.locationDescription}
		>
			{summary}
		</Typography>
	);
};

interface LocationStatsProps {
	locationStats: LocationDemoStats;
}

const LocationStats: React.FC<LocationStatsProps> = ({ locationStats }) => {
	const classes = useStyles();

	return (
		<div>
			{locationStats.map(({ title, stats }, i) => (
				<div key={i}>
					{/* Stat group title */}
					{title ? (
						<Typography
							component="h2"
							variant="h5"
							color="textSecondary"
							gutterBottom
						>
							{title}
						</Typography>
					) : null}
					<List dense>
						{stats.map(({ Icon, label, value }, j) => (
							<ListItem key={`${i}_${j}`}>
								{/* Icon */}
								<ListItemIcon>
									<Icon />
								</ListItemIcon>
								{/* Stat */}
								<ListItemText
									className={classes.statItem}
									primaryTypographyProps={{
										color: "textSecondary",
									}}
								>
									{label ? <b>{label}</b> : null}
								</ListItemText>

								<ListItemText
									className={classes.statItem}
									primaryTypographyProps={{
										color: "textSecondary",
									}}
								>
									{value}
								</ListItemText>
							</ListItem>
						))}
					</List>
				</div>
			))}
		</div>
	);
};

interface LocationDetailsProps {
	locationName: string;
	locationDetails: LocationWikiContent;
	onLargeScreen: boolean;
	containerHeight: number;
}

export const LocationDetails: React.FC<LocationDetailsProps> = (props) => {
	return (
		<>
			{props.onLargeScreen ? (
				<LocationDetailsDesktop {...props} />
			) : (
				<LocationDetailsMobile {...props} />
			)}
		</>
	);
};
