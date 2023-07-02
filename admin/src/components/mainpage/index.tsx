import React from "react";
import { CustomSideDrawer } from "./shared/side_drawer";
import { CustomAppBar } from "./shared/appbar";
import { Route, Routes } from "react-router-dom";

import { Box, CssBaseline, createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import Dashboard from "./components/dashboard/Dashboard";

const defaultTheme = createTheme();
export default function MainPage() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <CustomAppBar />
        <CustomSideDrawer />
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}
