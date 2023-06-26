import React from "react";
import { CustomSideDrawer } from "./shared_mainpage_files/side_drawer";
import { CustomAppBar } from "./shared_mainpage_files/appbar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import { Box, CssBaseline, createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

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
