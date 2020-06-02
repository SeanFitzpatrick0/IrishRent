import { useState, useEffect } from "react";
import { makeStyles, fade } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import PublishIcon from "@material-ui/icons/Publish";
import DoneIcon from "@material-ui/icons/Done";
import {
	EmailShareButton,
	EmailIcon,
	WhatsappShareButton,
	WhatsappIcon,
	TwitterShareButton,
	TwitterIcon,
	FacebookShareButton,
	FacebookIcon,
} from "react-share";
import { chunkArray } from "../../lib/Utils";

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

export default function Footer() {
	const aboutContent = {
		title: "About",
		items: [
			{ params: { label: "Home", link: "/" }, Render: FooterLink },
			{ params: { label: "About", link: "/#About" }, Render: FooterLink },
		],
	};
	const popularLocations = {
		title: "Popular Locations",
		items: [
			{
				params: { label: "Dublin", link: "/location/Dublin" },
				Render: FooterLink,
			},
			{
				params: { label: "Cork", link: "/location/Cork" },
				Render: FooterLink,
			},
			{
				params: { label: "Galway", link: "/location/Galway" },
				Render: FooterLink,
			},
			{
				params: { label: "Kildare", link: "/location/Kildare" },
				Render: FooterLink,
			},
			{
				params: { label: "Drogheda", link: "/location/Drogheda" },
				Render: FooterLink,
			},
			{
				params: { label: "Swords", link: "/location/Swords" },
				Render: FooterLink,
			},
			{
				params: { label: "Bray", link: "/location/Bray" },
				Render: FooterLink,
			},
			{
				params: { label: "Navan", link: "/location/Navan" },
				Render: FooterLink,
			},
		],
	};
	const finalColumn = {
		title: "Share",
		items: [
			{ params: {}, Render: ShareIcons },
			{ params: {}, Render: FeedbackInput },
		],
	};

	const classes = useStyles();
	return (
		<footer className={classes.footer}>
			<Container maxWidth="lg" className={classes.footerContainer}>
				<Grid container spacing={4} justify="space-evenly">
					<FooterColumn content={aboutContent} numbSubColumns={1} />
					<FooterColumn
						content={popularLocations}
						numbSubColumns={2}
					/>
					<FooterColumn content={finalColumn} numbSubColumns={1} />
				</Grid>
				<Box mt={5}>
					<Copyright />
				</Box>
			</Container>
		</footer>
	);
}

function Copyright() {
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
}

function FooterColumn({ content, numbSubColumns }) {
	const classes = useStyles();
	const subColumns = chunkArray(content.items, numbSubColumns);

	return (
		<Grid item xs={6} sm={3} key={content.title}>
			{/* Column Title */}
			<Typography
				variant="h6"
				gutterBottom
				className={classes.footerTitle}
			>
				{content.title}
			</Typography>

			{/* Column List(s) */}
			<div className={classes.subColumn}>
				{subColumns.map((column, i) => (
					<ul key={`${content.title}_${i}`}>
						{column.map(({ params, Render }, j) => (
							<li key={`${content.title}_${i}_${j}`}>
								<Render {...params} />
							</li>
						))}
					</ul>
				))}
			</div>
		</Grid>
	);
}

function FooterLink({ label, link }) {
	const classes = useStyles();
	return (
		<Link href={link} variant="subtitle1" className={classes.footerItem}>
			{label}
		</Link>
	);
}

function ShareIcons() {
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
}

function FeedbackInput() {
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
}
