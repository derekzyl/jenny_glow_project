import React, { createElement } from "react";
import { customDashboardI } from "./interface.dashboard/interface.dashboard";
import { Paper, Box, Typography, Card } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import InfoIcon from "@mui/icons-material/Info";
import NairaICon from "../../../../assets/svg.icons";
export function CustomDashboardItems({
  amount,
  children,
  icon,
  metadata,
  name,
  avatar_color,
}: customDashboardI) {
  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 100,
          }}
        >
          <Box
            sx={{
              overflow: "visible",

              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              "& .icon": {
                color: (theme) =>
                  theme.palette.mode === "dark" ? "inherit" : "#dc2440",
              },
            }}
          >
            {" "}
            <Box>
              <Avatar
                sx={{
                  background: `${avatar_color}`,
                  width: 60,
                  height: 60,
                }}
              >
                {icon}
              </Avatar>
            </Box>{" "}
            <Box textAlign="center">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <InfoIcon
                  className="info-when-hover"
                  sx={{ fontSize: 20, color: "hsl(120, 50%, 50%)" }}
                />
                <Paper elevation={2} className="popover-content">
                  <Box sx={{ opacity: 1 }}>
                    this is like a basic information about the stuff
                  </Box>
                </Paper>{" "}
                <Typography
                  color="textSecondary"
                  sx={{
                    textTransform: "capitalize",
                    position: "relative",
                    fontSize: 12,
                    fontWeight: 500,
                    p: -1,
                  }}
                >
                  {name}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <NairaICon />
                <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
                  {amount || " "}
                </Typography>
              </Box>
              <Typography color="textSecondary" sx={{ fontSize: 12 }}>
                {metadata || " "}
              </Typography>
              <div>
                {/* 
              {Object.entries(metadata).forEach(([key, value]) => {
                return (
                  <>
                    <Typography variant="h6" color="initial">
                      {key}: {value}
                    </Typography>
                  </>
                );
              })} */}
              </div>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
