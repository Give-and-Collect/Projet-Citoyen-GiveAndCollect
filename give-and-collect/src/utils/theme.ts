"use client";
import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#111D13',
            light: '#111D13',
            dark: '#111D13',
        },
        secondary: {
            main: '#8BD59E',
            light: '#8BD59E',
            dark: '#8BD59E',
        },
        success: {
            main: '#1B9476',
            light: '#1B9476',
            dark: '#1B9476',
        },
        error: {
            main: '#9e2222',
            light: '#9e2222',
            dark: '#9e2222',
        },
        warning: {
            main: '#f9872b',
            light: '#f9872b',
            dark: '#f9872b',
        },
        info: {
            main: '#8BD59E',
            light: '#8BD59E',
            dark: '#8BD59E',
        },
        background: {
            default: '#ffffff',
            paper: '#F4EEE0',
        },
        action: {
            active: '#F4EEE0',
            hover: '#DCD5C6',
            selected: '#DCD5C6',
            disabled: '#E2EAF4',
        },
        divider: 'rgba(140,110,110,0.12)',
    },
    typography: {
        fontFamily: 'League Spartan',
    },
});

export default theme;
