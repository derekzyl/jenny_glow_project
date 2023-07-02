import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import InventoryIcon from "@mui/icons-material/Inventory";

import ColorLensIcon from "@mui/icons-material/ColorLens";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { dashboardListI } from "../components/dashboard/interface.dashboard/interface.dashboard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import GroupIcon from "@mui/icons-material/Group";
import NotificationIcon from "@mui/icons-material/Notifications";
import SettingIcon from "@mui/icons-material/Settings";
import ShopIcon from "@mui/icons-material/Shop";
import StoreIcon from "@mui/icons-material/Store";

function dashboardList({ name, icon, onClick }: dashboardListI) {
  return { name, icon, onClick };
}

const dashboard_item: dashboardListI[] = [
  dashboardList({
    name: "Dashboard",
    icon: <DashboardIcon />,
    onClick: () => null,
  }),
  dashboardList({
    name: "Orders",
    icon: <ShopIcon sx={{ color: "hsl(40, 70%, 40%)" }} />,
    onClick: () => null,
  }),
  dashboardList({
    name: "Inventory",
    icon: <InventoryIcon />,
    onClick: () => null,
  }),
  dashboardList({
    name: "Products",
    icon: <CategoryIcon />,
    onClick: () => null,
  }),
  dashboardList({
    name: "Pos",
    icon: <PointOfSaleIcon />,
    onClick: () => null,
  }),
  dashboardList({
    name: "Expenditure",
    icon: <MonetizationOnIcon />,
    onClick: () => null,
  }),
  dashboardList({
    name: "Frontend",
    icon: <ColorLensIcon />,
    onClick: () => null,
  }),
  dashboardList({
    name: "Roles",
    icon: <AssignmentIndIcon />,
    onClick: () => null,
  }),
  dashboardList({
    name: "Users",
    icon: <PeopleIcon />,
    onClick: () => null,
  }),
  dashboardList({
    name: "Staffs",
    icon: <GroupIcon />,
    onClick: () => null,
  }),
  dashboardList({
    name: "Notifications",
    icon: <NotificationIcon />,
    onClick: () => null,
  }),
  dashboardList({
    name: "Branch",
    icon: <StoreIcon />,
    onClick: () => null,
  }),
];

export const mainListItems = (
  <>
    {dashboard_item
      .sort((a, b) => {
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      })
      .map((data, idx) => {
        return (
          <ListItemButton key={idx}>
            <ListItemIcon>{data.icon}</ListItemIcon>
            <ListItemText primary={data.name} />
          </ListItemButton>
        );
      })}
  </>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Vat" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <SettingIcon />
      </ListItemIcon>
      <ListItemText primary="settings" />
    </ListItemButton>
  </React.Fragment>
);
