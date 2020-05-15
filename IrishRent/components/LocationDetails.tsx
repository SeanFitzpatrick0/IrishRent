import React, { useRef, useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PeopleIcon from "@material-ui/icons/People";
import TramIcon from "@material-ui/icons/Tram";
import DirectionsBusIcon from "@material-ui/icons/DirectionsBus";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";

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
		width: "30%",
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
	hide: { display: "none" },
}));

export default function locationDetails({ locationName, locationDetails }) {
	// Styles
	const classes = useStyles();

	/* Is on large screen ? */
	const theme = useTheme();
	const onLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

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

	// Render
	return (
		<div
			ref={sidebar}
			className={`${classes.sidebar} ${!onLargeScreen && classes.hide}`}
			style={{ height }}
		>
			<Container>
				{/* Location Title */}
				<Typography
					component="h1"
					variant="h6"
					className={classes.locationTitle}
					color="textSecondary"
					gutterBottom
				>
					{locationName}
				</Typography>

				{/* Location Image */}
				<Box display="flex">
					<Box m="auto">
						<img
							className={classes.locationImg}
							src={`/images/location_images/${locationDetails.image}`}
							alt={`Rent Prices in ${locationName}`}
						/>
					</Box>
				</Box>

				{/* Location Description */}
				<Typography
					component="p"
					variant="body2"
					className={classes.locationDescription}
				>
					{locationDetails.summary}
				</Typography>

				{/* Location Stats */}
				<LocationStats locationStats={DEMO_STATS} />
			</Container>
		</div>
	);
}

// Render helpers
function LocationStats({ locationStats }) {
	const classes = useStyles();

	return (
		<div>
			{locationStats.map(({ title, stats }, i) => (
				<div key={i}>
					{/* Stat group title  TODO change to h2*/}
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
