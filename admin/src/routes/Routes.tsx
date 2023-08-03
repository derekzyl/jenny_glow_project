import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import SignIn from "../components/signin/SignIn";
import SignUp from "../components/signup/SignUp";
import MainPage from "../components/mainpage";
import Dashboard from "../components/mainpage/components/dashboard/Dashboard";
import Role from "../components/mainpage/components/role/role";
import ViewRole from "../components/mainpage/components/role/view.role";
import CreateRole from "../components/mainpage/components/role/create.role";
import ErrorPage from "../components/error-page/error-page";
import Branch from "../components/mainpage/components/branch/branch";
import Dispatch from "../components/mainpage/components/dispatch/dispatch";
import Pos from "../components/mainpage/components/pos/pos";

import Products from "../components/mainpage/components/product/product";
import Settings from "../components/mainpage/components/settings/settings";
import Sales from "../components/mainpage/components/sales/sales";
import Users from "../components/mainpage/components/users/users";
import Expenses from "../components/mainpage/components/expenses/expenses";
import Frontend from "../components/mainpage/components/frontend/role";
import Stocks from "../components/mainpage/components/stock/stock";
import Notifications from "../components/mainpage/components/notification/notification";
import Staffs from "../components/mainpage/components/staff/staff";
import Order from "../components/mainpage/components/orders/orders";

// const user

// export const router = createBrowserRouter(

//   createRoutesFromElements(
//     <>
//       <Route path="/home"  element={<MainPage /> } />
//       <Route path="/login" element={<SignIn />} />

//       <Route path="/signup" element={<SignUp />} />
//     </>
//   )
// );

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <MainPage />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "role/",
        element: <Role />,
        children: [
          {
            path: "",
            element: <ViewRole />,
          },
          {
            path: "add/",
            element: <CreateRole />,
          },
        ],
      },
      {
        path: "branch/",
        element: <Branch />,
        children: [
          {
            path: "",
            element: <ViewRole />,
          },
          {
            path: "add/",
            element: <CreateRole />,
          },
        ],
      },
      {
        path: "dispatch/",
        element: <Dispatch />,
        children: [
          {
            path: "",
            element: <ViewRole />,
          },
          {
            path: "add/",
            element: <CreateRole />,
          },
        ],
      },
      {
        path: "pos/",
        element: <Pos />,
        children: [
          {
            path: "",
            element: <ViewRole />,
          },
          {
            path: "add/",
            element: <CreateRole />,
          },
        ],
      },
      {
        path: "order/",
        element: <Order />,
        children: [
          {
            path: "",
            element: <ViewRole />,
          },
          {
            path: "add/",
            element: <CreateRole />,
          },
        ],
      },
      {
        path: "product/",
        element: <Products />,
        children: [
          {
            path: "",
            element: <ViewRole />,
          },
          {
            path: "add/",
            element: <CreateRole />,
          },
        ],
      },
      {
        path: "user/",
        element: <Users />,
        children: [
          {
            path: "",
            element: <ViewRole />,
          },
          {
            path: "add/",
            element: <CreateRole />,
          },
        ],
      },
      {
        path: "settings/",
        element: <Settings />,
        children: [
          {
            path: "",
            element: <ViewRole />,
          },
          {
            path: "add/",
            element: <CreateRole />,
          },
        ],
      },
      {
        path: "sales/",
        element: <Sales />,
        children: [
          {
            path: "",
            element: <ViewRole />,
          },
          {
            path: "add/",
            element: <CreateRole />,
          },
        ],
      },
      {
        path: "staff/",
        element: <Staffs />,
        children: [
          {
            path: "",
            element: <ViewRole />,
          },
          {
            path: "add/",
            element: <CreateRole />,
          },
        ],
      },
      {
        path: "expenses/",
        element: <Expenses />,
        children: [
          {
            path: "",
            element: <ViewRole />,
          },
          {
            path: "add/",
            element: <CreateRole />,
          },
        ],
      },
      {
        path: "frontend/",
        element: <Frontend />,
        children: [
          {
            path: "",
            element: <ViewRole />,
          },
          {
            path: "add/",
            element: <CreateRole />,
          },
        ],
      },
      {
        path: "stock/",
        element: <Stocks />,
        children: [
          {
            path: "",
            element: <ViewRole />,
          },
          {
            path: "add/",
            element: <CreateRole />,
          },
        ],
      },
      {
        path: "notification/",
        element: <Notifications />,
        children: [
          {
            path: "",
            element: <ViewRole />,
          },
          {
            path: "add/",
            element: <CreateRole />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);
