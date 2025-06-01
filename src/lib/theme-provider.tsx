"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import {
    ThemeProvider as MuiThemeProvider,
    createTheme,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";

// Custom MUI theme generator
const getMuiTheme = (mode: "light" | "dark") =>
    createTheme({
        palette: {
            mode,
            primary: {
                main: mode === "light" ? "#6200ea" : "#bb86fc",
            },
            background: {
                default: mode === "light" ? "#fafafa" : "#121212",
                paper: mode === "light" ? "#fff" : "#1e1e1e",
            },
        },
        typography: {
            fontFamily: "Inter, sans-serif",
        },
    });

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider {...props}>
            <MuiThemeWrapper>{children}</MuiThemeWrapper>
        </NextThemesProvider>
    );
}

// This handles MUI theme syncing with next-themes
function MuiThemeWrapper({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const theme = getMuiTheme((resolvedTheme as "light" | "dark") || "dark");

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
}
