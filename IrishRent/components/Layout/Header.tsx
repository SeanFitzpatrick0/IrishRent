import Router from "next/router";
import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import InputBase from "@material-ui/core/InputBase";
import Autocomplete, {
	createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/MoreVert";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PersonIcon from "@material-ui/icons/Person";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import {
	Location,
	AllLocationsRecord,
} from "../../lib/RentData/RentData_interfaces";
import { getLocationName, toURL, findLocationInRecords } from "../../lib/Utils";

// Constants
const ACCOUNT_ACTIONS_MENU_ID = "users-actions-menu";
const MOBILE_ACTIONS_MENU_ID = "mobile-actions-menu";
const SEARCH_BAR_PLACEHOLDER = "Search Location…";

// Styles Definition
const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1,
	},
	title: {
		display: "none",
		[theme.breakpoints.up("sm")]: {
			display: "block",
			width: "auto",
		},
		[theme.breakpoints.up("md")]: {
			marginLeft: theme.spacing(6),
			marginRight: theme.spacing(6),
		},
	},
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		"&:hover": { backgroundColor: fade(theme.palette.common.white, 0.25) },
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(3),
			width: "60%",
		},
		[theme.breakpoints.up("md")]: {
			marginLeft: theme.spacing(3),
			width: "35%",
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	inputRoot: {
		color: "inherit",
		width: "100%",
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: { width: "100%" },
	},
	navLink: {
		marginRight: theme.spacing(4),
		textTransform: "capitalize",
	},
	linksDesktop: {
		display: "none",
		[theme.breakpoints.up("md")]: {
			display: "flex",
			marginLeft: theme.spacing(6),
			marginRight: theme.spacing(6),
		},
	},
	linksMobile: {
		display: "flex",
		[theme.breakpoints.up("md")]: { display: "none" },
	},
}));

export default function Header({
	locations,
}: {
	locations: AllLocationsRecord;
}) {
	// Styles
	const classes = useStyles();

	// State
	/* the element that the menu is anchored to */
	const [
		accountActionsAnchorElement,
		setAccountActionsAnchorElement,
	] = React.useState(null);
	const [
		mobileMenuAnchorElement,
		setMobileMenuAnchorElement,
	] = React.useState(null);

	const isAccountActionsMenuOpen = Boolean(accountActionsAnchorElement);
	const isMobileMenuOpen = Boolean(mobileMenuAnchorElement);

	// Event Handlers
	const handleAccountActionsOpen = (e) => {
		setAccountActionsAnchorElement(e.currentTarget);
	};
	const handleMobileMenuOpen = (e) => {
		setMobileMenuAnchorElement(e.currentTarget);
	};
	const closeMenus = () => {
		setAccountActionsAnchorElement(null);
		setMobileMenuAnchorElement(null);
	};

	return (
		<div>
			<AppBar position="static">
				<Toolbar>
					{/* Brand */}
					<Typography className={classes.title} variant="h6" noWrap>
						IrishRent.ie
					</Typography>

					{/* Search Bar */}
					<SearchBar locations={locations} />

					{/* Add Space*/}
					<div className={classes.grow} />

					{/* Desktop Links */}
					<div className={classes.linksDesktop}>
						<Button
							className={classes.navLink}
							href="#TODO"
							color="secondary"
						>
							Locations
						</Button>
						<Button
							className={classes.navLink}
							href="#TODO"
							color="secondary"
						>
							Contact
						</Button>
						<IconButton
							edge="end"
							aria-label="user account actions"
							aria-haspopup="true"
							color="inherit"
							aria-controls={ACCOUNT_ACTIONS_MENU_ID}
							onClick={handleAccountActionsOpen}
						>
							<AccountCircle style={{ fontSize: 30 }} />
						</IconButton>
					</div>

					{/* Mobile Links Menu */}
					<div className={classes.linksMobile}>
						<IconButton
							color="inherit"
							aria-label="show more"
							aria-haspopup="true"
							aria-controls={MOBILE_ACTIONS_MENU_ID}
							onClick={handleMobileMenuOpen}
						>
							<MoreIcon />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>

			{/* Account Actions Menu (Desktop) */}
			<HeaderMenu
				anchorElement={accountActionsAnchorElement}
				id={ACCOUNT_ACTIONS_MENU_ID}
				isOpen={isAccountActionsMenuOpen}
				handelClose={closeMenus}
				items={[
					{ Icon: PersonIcon, label: "Log in" },
					{ Icon: PersonAddIcon, label: "Register" },
				]}
			/>
			{/* All Actions Menu (Mobile) */}
			<HeaderMenu
				anchorElement={mobileMenuAnchorElement}
				id={MOBILE_ACTIONS_MENU_ID}
				isOpen={isMobileMenuOpen}
				handelClose={closeMenus}
				items={[
					{ Icon: LocationCityIcon, label: "Locations" },
					{ Icon: ContactSupportIcon, label: "Contact" },
					{ Icon: PersonIcon, label: "Log in" },
					{ Icon: PersonAddIcon, label: "Register" },
				]}
			/>
		</div>
	);
}

// Render Helpers
function HeaderMenu({ anchorElement, id, isOpen, handelClose, items }) {
	return (
		<Menu
			anchorEl={anchorElement}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			id={id}
			keepMounted
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isOpen}
			onClose={handelClose}
		>
			{items.map(({ Icon, label }, i) => (
				<MenuItem key={i} onClick={handelClose}>
					<IconButton color="inherit">
						<Icon aria-label={label} />
					</IconButton>
					<p>{label}</p>
				</MenuItem>
			))}
		</Menu>
	);
}

function SearchBar({ locations }: { locations: AllLocationsRecord }) {
	// Styles
	const classes = useStyles();

	// State
	const options = [
		...locations.counties,
		...locations.postcodes,
		...locations.towns,
	];
	const filterOptions = createFilterOptions({
		matchFrom: "start",
		trim: true,
		limit: 5,
	});
	const [inputValue, setInputValue] = React.useState("");

	// Handle Search
	const handelSubmit = (e) => {
		e.preventDefault();
		const locationID = findLocationInRecords(inputValue, locations);
		if (locationID)
			Router.push("/location/[id]", `/location/${toURL(locationID)}`);
		else console.warn(`WARN: No Locations named ${inputValue}`); // TODO redirect to all locations page (maybe)
	};

	// Render Helpers
	const InputRender = ({ params }) => (
		<>
			<div className={classes.searchIcon}>
				<SearchIcon />
			</div>
			<InputBase
				ref={params.InputProps.ref}
				inputProps={params.inputProps}
				placeholder={SEARCH_BAR_PLACEHOLDER}
				autoFocus
				classes={{
					root: classes.inputRoot,
					input: classes.inputInput,
				}}
			/>
		</>
	);
	const SuggestionRender = ({ option, inputValue }) => {
		const locationName = getLocationName(option);
		const matches = match(locationName, inputValue);
		const parts = parse(locationName, matches);
		return (
			<div>
				{parts.map((part, i) => (
					<span
						key={i}
						style={{ fontWeight: part.highlight ? 700 : 400 }}
					>
						{part.text}
					</span>
				))}
			</div>
		);
	};

	// Render
	return (
		<form className={classes.search} onSubmit={handelSubmit.bind(this)}>
			<Autocomplete
				freeSolo
				options={inputValue.length > 0 ? options : []}
				onInputChange={(e, newInput) => setInputValue(newInput)}
				getOptionLabel={(option: Location) =>
					typeof option === "string"
						? option
						: getLocationName(option)
				}
				filterOptions={filterOptions}
				renderInput={(params) => <InputRender params={params} />}
				groupBy={(option: Location) => option.locationType}
				renderOption={(option: Location, { inputValue }) => (
					<SuggestionRender option={option} inputValue={inputValue} />
				)}
			/>
		</form>
	);
}
