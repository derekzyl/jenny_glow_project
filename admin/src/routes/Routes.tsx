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
