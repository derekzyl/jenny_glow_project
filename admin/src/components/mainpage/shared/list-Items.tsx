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
import { NavLink } from "react-router-dom";
import { Divider, Typography } from "@mui/material";
import { colorScheme } from "../../utilities/color-scheme";
import { CrudItemI, CrudItemPropI } from "./interface.shared";

function dashboardList({ name, icon, onClick, link_to }: dashboardListI) {
  return { name, icon, onClick, link_to };
}
// this is a side drawer for the dashboard
const dashboard_item: dashboardListI[] = [
  dashboardList({
    name: "Dashboard",
    icon: <DashboardIcon />,
    onClick: () => null,
    link_to: "",
  }),
  dashboardList({
    name: "Orders",
    icon: <ShopIcon sx={{ color: "hsl(40, 70%, 40%)" }} />,
    onClick: () => null,
    link_to: "",
  }),
  dashboardList({
    name: "Inventory",
    icon: <InventoryIcon />,
    onClick: () => null,
    link_to: "",
  }),
  dashboardList({
    name: "Products",
    icon: <CategoryIcon />,
    onClick: () => null,
    link_to: "",
  }),
  dashboardList({
    name: "Pos",
    icon: <PointOfSaleIcon />,
    onClick: () => null,
    link_to: "",
  }),
  dashboardList({
    name: "Expenditure",
    icon: <MonetizationOnIcon />,
    onClick: () => null,
    link_to: "",
  }),
  dashboardList({
    name: "Frontend",
    icon: <ColorLensIcon />,
    onClick: () => null,
    link_to: "",
  }),
  dashboardList({
    name: "Roles",
    icon: <AssignmentIndIcon />,
    onClick: () => null,
    link_to: "/role",
  }),
  dashboardList({
    name: "Users",
    icon: <PeopleIcon />,
    onClick: () => null,
    link_to: "",
  }),
  dashboardList({
    name: "Staffs",
    icon: <GroupIcon />,
    onClick: () => null,
    link_to: "",
  }),
  dashboardList({
    name: "Notifications",
    icon: <NotificationIcon />,
    onClick: () => null,
    link_to: "",
  }),
  dashboardList({
    name: "Branch",
    icon: <StoreIcon />,
    onClick: () => null,
    link_to: "",
  }),
];

// mapping the side drwer
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
          <NavLink
            key={idx}
            className={({ isActive, isPending }) =>
              isActive ? "active" : isPending ? "pending" : ""
            }
            to={data.link_to}
          >
            <ListItemButton sx={{ fontSize: 12 }}>
              <ListItemIcon sx={{ color: colorScheme.secondary_1 }}>
                {data.icon}
              </ListItemIcon>
              <ListItemText
                primary={data.name}
                sx={{
                  color: colorScheme.dark_1,
                }}
              />
            </ListItemButton>
          </NavLink>
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

// a list of crud functions with nav link

// eslint-disable-next-line react-refresh/only-export-components
export const roleCrud: CrudItemI[] = [
  {
    link_to: "/role/",
    name: "View Roles",
  },
  {
    link_to: "/role/add/",
    name: "New Role",
  },
];

/**
 *
 * @param data  it takes the link to and the name of t he list
 * @returns
 */
export function CrudItems({ data }: CrudItemPropI) {
  return (
    <>
      {Object.entries(data).map(([idx, item]) => {
        return (
          <NavLink
            key={idx}
            className={({ isActive, isPending }) =>
              isActive ? "active" : isPending ? "pending" : ""
            }
            to={item.link_to}
          >
            <Typography
              key={idx}
              fontSize={16}
              color="textSecondary"
              sx={{
                textTransform: "capitalize",
                position: "relative",

                fontWeight: 500,
                color: colorScheme.dark_0,
                py: 2,
              }}
            >
              {" "}
              {item.name}
            </Typography>
            <Divider />
          </NavLink>
        );
      })}
    </>
  );
}
