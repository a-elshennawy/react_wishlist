import "./App.css";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoaderSpinner from "./Components/ReusableComponents/LoaderSpinner";
import Layout from "./Components/Layout/Layout";
import { AuthProvider } from "./Components/Contexts/AuthContext";
import Docs from "./Components/Pages/Docs";
import { Offline } from "react-detect-offline";

const LandingPage = lazy(() => import("./Components/Pages/LandingPage"));
const Login = lazy(() => import("./Components/Pages/Login"));
const Signup = lazy(() => import("./Components/Pages/Signup"));
const ForgotPassword = lazy(() => import("./Components/Pages/ForgotPassword"));

const createRoute = (path, element) => ({
  path,
  element: <Suspense fallback={<LoaderSpinner />}>{element}</Suspense>,
});

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        createRoute("", <LandingPage />),
        createRoute("docs", <Docs />),
      ],
    },
    createRoute("/login", <Login />),
    createRoute("/signup", <Signup />),
    createRoute("/forgotPassword", <ForgotPassword />),
  ]);
  return (
    <AuthProvider>
      <Offline>
        <div className="offline-message">
          You're offline. Check your connection.
        </div>
      </Offline>
      <RouterProvider router={routes} />
    </AuthProvider>
  );
}

export default App;
