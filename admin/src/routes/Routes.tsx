import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import SignIn from "../components/signin/SignIn";
import SignUp from "../components/signup/SignUp";
import MainPage from "../components/mainpage";

// const user

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<SignIn />} />

      <Route path="/signup" element={<SignUp />} />
    </>
  )
);
