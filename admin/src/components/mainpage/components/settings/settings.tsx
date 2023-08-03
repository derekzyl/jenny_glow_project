import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { colorScheme } from "../../../utilities/color-scheme";
import { CrudItems, roleCrud } from "../../shared/list-Items";
import { PageMajorLayout, PageMiniLayout } from "../../shared/pages-layout";
import { Outlet } from "react-router-dom";

export default function Settings() {
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
        display: "flex",
        justifyContent: "space-between",
        mt: 8,
      }}
    >
      <Container maxWidth={false} sx={{ mx: 2, mt: 4, mb: 4 }}>
        <Typography sx={{ m: 1, color: colorScheme.dark_2 }} variant="h4">
          {" "}
          Settings
        </Typography>
        <Grid container spacing={1}>
          <PageMiniLayout children={<CrudItems data={roleCrud} />} />

          <PageMajorLayout children={<Outlet />} />
        </Grid>
      </Container>
    </Box>
  );
}
