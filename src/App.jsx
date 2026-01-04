import "./App.css";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoaderSpinner from "./Components/ReusableComponents/LoaderSpinner";
import Layout from "./Components/Layout/Layout";
import { AuthProvider } from "./Components/Contexts/AuthContext";

const LandingPage = lazy(() => import("./Pages/LandingPage"));
const Login = lazy(() => import("./Pages/Login"));
const Signup = lazy(() => import("./Pages/Signup"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const Not_Found = lazy(() => import("./Pages/Not_Found"));

const createRoute = (path, element) => ({
  path,
  element: <Suspense fallback={<LoaderSpinner />}>{element}</Suspense>,
});

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [createRoute("", <LandingPage />)],
    },
    createRoute("/login", <Login />),
    createRoute("/signup", <Signup />),
    createRoute("/forgotPassword", <ForgotPassword />),
    createRoute("*", <Not_Found />),
  ]);
  return (
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  );
}

export default App;
