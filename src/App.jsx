import "./App.css";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoaderSpinner from "./Components/ReusableComponents/LoaderSpinner";
import Layout from "./Components/Layout/Layout";
import { AuthProvider } from "./Components/Contexts/AuthContext";

const LandingPage = lazy(() => import("./Pages/LandingPage"));
const Auth = lazy(() => import("./Pages/auth/Auth"));
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
    createRoute("/auth", <Auth />),
    createRoute("*", <Not_Found />),
  ]);
  return (
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  );
}

export default App;
