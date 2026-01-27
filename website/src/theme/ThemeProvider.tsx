"use client";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

import CssBaseline from "@mui/material/CssBaseline";
// import DARK_THEME from "./dark";
// import LIGHT_THEME from "./light";
import MuiThemeProviderForNextJs from "./MuiThemeProviderForNextJs";
import { theme } from "./theme";

// function getThemeByDarkMode(darkMode: boolean) {
//   return darkMode ? createTheme(DARK_THEME) : createTheme(LIGHT_THEME);
// }

/**
 * Renders composition of Emotion's CacheProvider + MUI's ThemeProvider to wrap content of entire App
 * The Light or Dark themes applied depending on global .darkMode state
 * @component AppThemeProvider
 */
const AppThemeProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => setLoading(false), []); // Set .loading to false when the component is mounted

  if (loading) return null; // Don't render anything until the component is mounted

  return (
    <MuiThemeProviderForNextJs>
      <MuiThemeProvider theme={theme}>
        <CssBaseline /* MUI Styles */ />
        {children}
      </MuiThemeProvider>
    </MuiThemeProviderForNextJs>
  );
};

export default AppThemeProvider;
