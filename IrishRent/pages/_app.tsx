import { AppProps } from "next/app";
import {
	createMuiTheme,
	responsiveFontSizes,
	ThemeProvider,
} from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

export const theme = responsiveFontSizes(
	createMuiTheme({
		palette: {
			primary: { main: "#329A2F" },
			secondary: { main: "#FFF" },
		},
	})
);

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Component {...pageProps} />
		</ThemeProvider>
	);
}
