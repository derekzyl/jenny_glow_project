import React, { ReactNode } from "react";

export interface dashboardListI {
  icon: React.ReactElement;
  name: string;
  onClick: () => void;
  link_to: string;
}

export interface customDashboardI {
  name: string;
  icon: JSX.Element;
  amount: number;
  metadata?: string;
  children?: string | JSX.Element | JSX.Element[];
  avatar_color: string;
}
