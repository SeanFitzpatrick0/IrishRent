import ReactGA from "react-ga4";

export function initGA() {
	if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID)
		ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
	else console.error("Unable to access NEXT_PUBLIC_GOOGLE_ANALYTICS_ID");
}

export function logPageView() {
	ReactGA.set({ page: window.location.pathname });
}

export function logEvent(category = "", action = "") {
	if (category && action) ReactGA.event({ category, action });
}
