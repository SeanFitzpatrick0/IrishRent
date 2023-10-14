import {
	EmailIcon,
	EmailShareButton,
	FacebookIcon,
	FacebookShareButton,
	TwitterIcon,
	TwitterShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from "react-share";
import React, { useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";

import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import DoneIcon from "@material-ui/icons/Done";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import PublishIcon from "@material-ui/icons/Publish";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { chunkArray } from "../../lib/Utils";
import green from "@material-ui/core/colors/green";

const useStyles = makeStyles((theme) => ({
	"@global": {
		ul: {
			margin: 0,
			padding: 0,
			listStyle: "none",
		},
	},
	footer: { backgroundColor: "#5C5B5B" },
	footerContainer: {
		marginTop: theme.spacing(6),
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
	},
	footerTitle: { color: fade(theme.palette.common.white, 0.85) },
	footerItem: { color: fade(theme.palette.common.white, 0.65) },
	subColumn: { display: "flex", justifyContent: "space-between" },
	socialButton: { margin: theme.spacing(0.5) },
	feedbackInputRoot: {
		"& .MuiOutlinedInput-root": {
			color: fade(theme.palette.common.white, 0.85),
			backgroundColor: fade(theme.palette.common.white, 0.15),
			"& fieldset": {
				borderColor: fade(theme.palette.common.white, 0.65),
			},
			"&:hover fieldset": {
				borderColor: fade(theme.palette.common.white, 0.65),
			},
		},
		"& label.Mui-disabled": { color: green[400] },
	},
	feedbackInputLabel: {
		color: fade(theme.palette.common.white, 0.65),
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
		right: "60px", // Room for submit icon
	},
}));

interface FooterColumnContent<T> {
	title: string;
	items: { params: T; Render: React.FC<T> }[];
}

interface FooterLinkProps {
	label: string;
	link: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ label, link }) => {
	const classes = useStyles();
	return (
		<Link href={link} variant="subtitle1" className={classes.footerItem}>
			{label}
		</Link>
	);
};

const ShareIcons: React.FC = () => {
	const shareUrl = "http://irishrent.ie";
	const shareSubject = "View Rent Prices in Ireland at Irishrent.ie";
	const shareMessage =
		"Looking to rent a house or apartment at the right price?,\n" +
		"Use Irishrent.ie to find rent prices for towns across Ireland to help you find the best place to rent.\n";

	// Styles
	const classes = useStyles();

	return (
		<>
			<EmailShareButton
				url={shareUrl}
				subject={shareSubject}
				body={shareMessage}
				className={classes.socialButton}
			>
				<EmailIcon size={32} round />
			</EmailShareButton>
			<WhatsappShareButton
				url={shareUrl}
				title={shareSubject}
				separator=":: "
				className={classes.socialButton}
			>
				<WhatsappIcon size={32} round />
			</WhatsappShareButton>
			<TwitterShareButton
				url={shareUrl}
				title={shareSubject}
				className={classes.socialButton}
			>
				<TwitterIcon size={32} round />
			</TwitterShareButton>
			<FacebookShareButton
				url={shareUrl}
				quote={shareMessage}
				className={classes.socialButton}
			>
				<FacebookIcon size={32} round />
			</FacebookShareButton>
		</>
	);
};

const FeedbackInput: React.FC = () => {
	// Styles
	const classes = useStyles();

	// State
	const [feedback, setFeedback] = useState("");
	const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);

	const Icon = feedbackSubmitted ? DoneIcon : PublishIcon;
	const label = feedbackSubmitted
		? "Thank you for feedback"
		: "How can we improve ?";

	// Handlers
	const handelSubmit = async (e) => {
		e.preventDefault();
		const sentFromUrl = window.location.href;

		// Send Feedback
		fetch("/api/feedback", {
			method: "POST",
			body: JSON.stringify({ feedback, sentFromUrl }),
		}).then(async (res) => {
			if (res.status === 200) {
				// Successful POST
				setFeedback("");
				setFeedbackSubmitted(true);
			} else {
				const errorMessage = await res.text();
				setErrorMessage(errorMessage);
			}
		});
	};

	const handelChange = (e) => {
		setFeedback(e.currentTarget.value);
		setErrorMessage(null);
	};

	return (
		<form onSubmit={(e) => handelSubmit(e)} autoComplete="off">
			<Typography
				variant="h6"
				gutterBottom
				className={classes.footerTitle}
			>
				Feedback
			</Typography>
			<TextField
				value={feedback}
				onChange={(e) => handelChange(e)}
				disabled={feedbackSubmitted}
				error={Boolean(errorMessage)}
				helperText={errorMessage}
				variant="outlined"
				label={label}
				size="small"
				color="secondary"
				className={classes.feedbackInputRoot}
				InputLabelProps={{ className: classes.feedbackInputLabel }}
				InputProps={{
					endAdornment: (
						<IconButton
							type="submit"
							aria-label="Submit Feedback"
							disabled={feedbackSubmitted}
						>
							<Icon
								className={classes.footerItem}
								fontSize="small"
							/>
						</IconButton>
					),
				}}
			/>
		</form>
	);
};

const ABOUT_CONTENT: FooterColumnContent<FooterLinkProps> = {
	title: "About",
	items: [
		{ params: { label: "Home", link: "/" }, Render: FooterLink },
		{ params: { label: "About", link: "/#About" }, Render: FooterLink },
		{
			params: { label: "Locations", link: "/location" },
			Render: FooterLink,
		},
	],
};

const POPULAR_LOCATIONS = [
	"Dublin",
	"Cork",
	"Galway",
	"Kildare",
	"Drogheda",
	"Swords",
	"Bray",
	"Navan",
];

const POPULAR_LOCATIONS_CONTENT: FooterColumnContent<FooterLinkProps> = {
	title: "Popular Locations",
	items: POPULAR_LOCATIONS.map((locationId) => ({
		params: {
			label: locationId,
			link: `/location/${locationId}`,
		},
		Render: FooterLink,
	})),
};

const FINAL_COLUMN_CONTENT: FooterColumnContent<{}> = {
	title: "Share",
	items: [
		{ params: {}, Render: ShareIcons },
		{ params: {}, Render: FeedbackInput },
	],
};

export const Footer: React.FC = () => {
	const classes = useStyles();
	return (
		<footer className={classes.footer}>
			<Container maxWidth="lg" className={classes.footerContainer}>
				<Grid container spacing={4} justifyContent="space-evenly">
					<FooterColumn content={ABOUT_CONTENT} numbSubColumns={1} />
					<FooterColumn
						content={POPULAR_LOCATIONS_CONTENT}
						numbSubColumns={2}
					/>
					<FooterColumn
						content={FINAL_COLUMN_CONTENT}
						numbSubColumns={1}
					/>
				</Grid>
				<Box mt={5}>
					<Copyright />
				</Box>
			</Container>
		</footer>
	);
};

const Copyright: React.FC = () => {
	const classes = useStyles();
	return (
		<Typography
			className={classes.footerItem}
			variant="body2"
			align="center"
		>
			{"Copyright © "}
			<Link color="inherit" href="/">
				Irishrent.ie
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
};

interface FooterColumnProps<T> {
	content: FooterColumnContent<T>;
	numbSubColumns: number;
}

const FooterColumn: React.FC<FooterColumnProps<any>> = ({
	content: { title, items },
	numbSubColumns,
}) => {
	const classes = useStyles();
	const subColumns = chunkArray(items, numbSubColumns);

	return (
		<Grid item xs={6} sm={3} key={title}>
			{/* Column Title */}
			<Typography
				variant="h6"
				gutterBottom
				className={classes.footerTitle}
			>
				{title}
			</Typography>

			{/* Column List(s) */}
			<div className={classes.subColumn}>
				{subColumns.map((column, i) => (
					<ul key={`${title}_${i}`}>
						{column.map(({ params, Render }, j) => (
							<li key={`${title}_${i}_${j}`}>
								<Render {...params} />
							</li>
						))}
					</ul>
				))}
			</div>
		</Grid>
	);
};
