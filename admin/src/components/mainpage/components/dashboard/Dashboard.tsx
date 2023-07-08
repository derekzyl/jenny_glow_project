import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Orders from "./Orders";
import Chart from "./Chart";
import PaidIcon from "@mui/icons-material/Paid";
import { CustomDashboardItems } from "./utilities.dashboard";
import Typography from "@mui/material/Typography";

export default function Dashboard() {
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
      }}
    >
      <Toolbar />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={1}>
          <Paper
            sx={{
              p: 2,
              m: 1,
              display: "flex",
              flexDirection: "column",
              height: 100,
              width: "100%",
            }}
          ></Paper>
        </Grid>

        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Paper sx={{ my: 2, p: 1, background: "hsla(10,10%, 90%,0.2)" }}>
              <Typography
                color="initial"
                sx={{
                  fontWeight: 500,
                  margin: 1,
                  color: "hsl(0, 10%, 10%)",
                  textTransform: "capitalize",
                }}
              >
                {" "}
                total sales
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={4}>
                  <CustomDashboardItems
                    amount={100}
                    icon={<PaidIcon sx={{ fontSize: 40 }} />}
                    name={"total sales"}
                    metadata="condition"
                    avatar_color="hsl(10, 50%, 50%)"
                  />
                </Grid>
                {/* Recent Deposits */}
                <Grid item xs={12} md={4} lg={4}>
                  <CustomDashboardItems
                    amount={100}
                    icon={<PaidIcon sx={{ fontSize: 40 }} />}
                    name={"item discount"}
                    metadata="condition"
                    avatar_color="hsl(180, 50%, 50%)"
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <CustomDashboardItems
                    amount={100}
                    icon={<PaidIcon sx={{ fontSize: 40 }} />}
                    name={"total vat"}
                    metadata="condition"
                    avatar_color="hsl(240, 50%, 50%)"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ my: 2, p: 1, background: "hsla(10,10%, 90%,0.2)" }}>
              <Typography
                color="initial"
                sx={{
                  fontWeight: 500,
                  margin: 1,
                  color: "hsl(0, 10%, 10%)",
                  textTransform: "capitalize",
                }}
              >
                {" "}
                daily sales
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={4}>
                  <CustomDashboardItems
                    amount={100}
                    icon={<PaidIcon sx={{ fontSize: 40 }} />}
                    name={"total sales"}
                    metadata="condition"
                    avatar_color="hsl(10, 50%, 50%)"
                  />
                </Grid>
                {/* Recent Deposits */}
                <Grid item xs={12} md={4} lg={4}>
                  <CustomDashboardItems
                    amount={100}
                    icon={<PaidIcon sx={{ fontSize: 40 }} />}
                    name={"item discount"}
                    metadata="condition"
                    avatar_color="hsl(180, 50%, 50%)"
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <CustomDashboardItems
                    amount={100}
                    icon={<PaidIcon sx={{ fontSize: 40 }} />}
                    name={"total vat"}
                    metadata="condition"
                    avatar_color="hsl(240, 50%, 50%)"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Orders />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              chart
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              sales
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              product stock
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              dispatch
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              product stock
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
