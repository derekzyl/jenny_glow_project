import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Card, CardActions, CircularProgress } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { CustomButton } from "../utilities/button";
// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignIn() {
  const loading = false;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "flex-start",
        background: "url(https://source.unsplash.com/featured/1600x900)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Card sx={{ minWidth: 300, marginTop: "14em" }}>
        <Box
          sx={{
            margin: "1em",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Avatar sx={{ bgcolor: "secondary.main" }}>
            <LockIcon />
          </Avatar>
        </Box>
        <Box
          sx={{
            marginTop: "1em",
            display: "flex",
            justifyContent: "center",
            color: (theme) => theme.palette.grey[500],
          }}
        >
          Jenny Glow
        </Box>
        <Box sx={{ padding: "0 1em 1em 1em" }}>
          <Box sx={{ marginTop: "1em" }}>
            <TextField
              autoFocus
              label="username"
              disabled={false} /*{loading}*/
              fullWidth
              variant="standard"
            />
          </Box>
          <Box sx={{ marginTop: "1em" }}>
            <TextField
              label="password"
              type="password"
              disabled={false} /*{loading}*/
              fullWidth
              variant="standard"
            />
          </Box>
        </Box>
        <CardActions
          sx={{
            padding: "0 1em 1em 1em",
            height: "100px",
          }}
        >
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={false} /*{loading}*/
            fullWidth
          >
            {loading && <CircularProgress size={25} thickness={2} />}
            signin
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
