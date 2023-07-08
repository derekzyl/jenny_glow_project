import { Grid, Paper } from "@mui/material";
import React, { Children } from "react";
import { colorScheme } from "../../utilities/color-scheme";

export function PageMiniLayout({ children }: { children: any }) {
  return (
    <Grid item xs={4} md={2} lg={2}>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          background: colorScheme.gray_1,
          justifyContent: "flex-start",
          maxWidth: "calc(100% - 50px)",
          py: 4,
          alignItems: "center",
          mx: 1,
        }}
      >
        {children}
      </Paper>
    </Grid>
  );
}

export function PageMajorLayout({ children }: { children: any }) {
  return (
    <Grid item xs={8} md={6} lg={10}>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          height: 500,

          background: colorScheme.gray_1,
          borderTop: `6px solid ${colorScheme.primary} `,
        }}
      >
        {children}
      </Paper>
    </Grid>
  );
}
