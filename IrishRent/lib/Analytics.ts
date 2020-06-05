import ReactGA from "react-ga";

export function initGA() {
	ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID);
}

export function logPageView() {
	ReactGA.set({ page: window.location.pathname });
	ReactGA.pageview(window.location.pathname);
}

export function logEvent(category = "", action = "") {
	if (category && action) ReactGA.event({ category, action });
}

export function logException(description = "", fatal = false) {
	if (description) ReactGA.exception({ description, fatal });
}
