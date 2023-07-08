import React from "react";
import { CustomSideDrawer } from "./shared/side-drawer";
import { CustomAppBar } from "./shared/appbar";
import { Outlet, Route, Routes } from "react-router-dom";

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
        <Outlet />
        {/* <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/" element={<Role />} />
        </Routes> */}
      </Box>
    </ThemeProvider>
  );
}
