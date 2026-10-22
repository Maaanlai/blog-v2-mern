import { createThemes } from "tw-colors"

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		fontSize: {
			sm: "12px",
			base: "14px",
			xl: "16px",
			"2xl": "20px",
			"3xl": "28px",
			"4xl": "38px",
			"5xl": "50px",
		},

		extend: {
			boxShadow: {
				soft: "4px 4px 50px -4px rgba(209, 209, 209, 0.6)",
				float: "0 35px 24px -10px rgba(209, 209, 209, 0.8)",
			},
			borderRadius: {
				bubble: "0 2.7rem 2.7rem 2.7rem",
			},
			fontFamily: {
				inter: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
				gelasio: ["'Gelasio'", "serif"],
			},
		},
	},
	plugins: [
		createThemes({
			light: {
				white: "#FFFFFF",
				black: "#1C1C1C",
				grey: "#F3F3F3",
				"dark-grey": "#6B6B6B",
				red: "#FF4E4E",
				transparent: "transparent",
				twitter: "#1DA1F2",
				purple: "#890DAB",
				paper: "#FAFAFA",
				line: "#E6E6E6",
				muted: "#888888",
				accent: "#890DAB",
				"accent-soft": "#C45BEB",
				ink: "#000000",
			},
			dark: {
				white: "#242424",
				black: "#F3F3F3",
				grey: "#2A2A2A",
				"dark-grey": "#E7E7E7",
				red: "#991F1F",
				transparent: "transparent",
				twitter: "#0E71A8",
				purple: "#6E0A8A",
				paper: "#1A1A1A",
				line: "#333333",
				muted: "#9A9A9A",
				accent: "#C45BEB",
				"accent-soft": "#D98BF2",
				ink: "#000000",
			},
		}),
	],
}
