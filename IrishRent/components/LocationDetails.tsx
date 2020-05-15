import React, { useRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import PeopleIcon from "@material-ui/icons/People";
import TramIcon from "@material-ui/icons/Tram";
import DirectionsBusIcon from "@material-ui/icons/DirectionsBus";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";

// TODO Place holder data
const DEMO_STATS = [
	{
		title: null,
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

export default function locationDetails({
	locationName,
	locationDetails,
	onLargeScreen,
}) {
	return (
		<>
			{onLargeScreen ? (
				<LocationDetailsDesktop
					locationName={locationName}
					locationDetails={locationDetails}
				/>
			) : (
				<LocationDetailsMobile
					locationName={locationName}
					locationDetails={locationDetails}
				/>
			)}
		</>
	);
}

// Render helpers
function LocationDetailsDesktop({ locationName, locationDetails }) {
	// Styles
	const classes = useStyles();

	// State
	const sidebar = useRef(null);
	const [height, setHeight] = useState(null);

	const setSidebarHeight = () => {
		const heightOfSide =
			window.innerHeight -
			(sidebar.current?.getBoundingClientRect().top || 0);
		setHeight(heightOfSide);
	};

	useEffect(() => {
		/* set hight of side bar to reach bottom of screen 
			and add event listener to update height on resize */
		setSidebarHeight();
		window.addEventListener("resize", setSidebarHeight);
	}, []);

	return (
		<div ref={sidebar} className={classes.sidebar} style={{ height }}>
			<Container>
				<LocationTitle>{locationName}</LocationTitle>
				<LocationImage
					locationName={locationName}
					image={locationDetails.image}
				/>
				<LocationSummary locationSummary={locationDetails.summary} />
				<LocationStats locationStats={DEMO_STATS} />
			</Container>
		</div>
	);
}

function LocationDetailsMobile({ locationName, locationDetails }) {
	// Styles
	const classes = useStyles();

	// State
	const [open, setOpen] = React.useState(false);
	const toggleOpen = () => setOpen((currentState) => !currentState);

	return (
		<Container>
			<LocationTitle>
				{locationName}
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
}

function LocationDetailsDialog({
	locationName,
	locationDetails,
	open,
	onClose,
}) {
	// Styles
	const classes = useStyles();

	return (
		<Dialog
			onClose={onClose}
			aria-labelledby="location-dialog-title"
			open={open}
		>
			<MuiDialogTitle>
				<Typography variant="h6">{locationName}</Typography>
				<IconButton
					aria-label="close"
					onClick={onClose}
					className={classes.closeButton}
				>
					<CloseIcon />
				</IconButton>
			</MuiDialogTitle>

			<MuiDialogContent dividers>
				<LocationImage
					locationName={locationName}
					image={locationDetails.image}
				/>
				<LocationSummary locationSummary={locationDetails.summary} />
				<LocationStats locationStats={DEMO_STATS} />
			</MuiDialogContent>
		</Dialog>
	);
}

function LocationTitle(props) {
	const classes = useStyles();
	return (
		<Typography
			component="h1"
			variant="h6"
			className={classes.locationTitle}
			color="textSecondary"
			gutterBottom
		>
			{props.children}
		</Typography>
	);
}

function LocationImage({ locationName, image }) {
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
}

function LocationSummary({ locationSummary }) {
	const classes = useStyles();
	return (
		<Typography
			component="p"
			variant="body2"
			className={classes.locationDescription}
		>
			{locationSummary}
		</Typography>
	);
}

function LocationStats({ locationStats }) {
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
}
