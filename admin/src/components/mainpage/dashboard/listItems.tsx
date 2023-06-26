import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";

import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { dashboardListI } from "./interface.dashboard/interface.dashboard";

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
    icon: <ShoppingCartIcon />,
    onClick: () => null,
  }),
  dashboardList({
    name: "Inventory",
    icon: <InventoryIcon />,
    onClick: () => null,
  }),
  dashboardList({
    name: "Products",
    icon: <InventoryIcon />,
    onClick: () => null,
  }),
];

export const mainListItems = (
  <>
    {dashboard_item.map((data, idx) => {
      return (
        <ListItemButton key={idx}>
          <ListItemIcon>{data.icon}</ListItemIcon>
          <ListItemText primary={data.name} />
        </ListItemButton>
      );
    })}
  </>
);

export const mainListItemsf = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Inventory" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Shipping fee" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Products" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Inventory" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Vat" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="settings" />
    </ListItemButton>
  </React.Fragment>
);
