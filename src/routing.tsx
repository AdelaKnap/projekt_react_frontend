import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";

// Routing med layout fil som huvudfil
const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/book/:id",
                element: <BookDetailsPage />
            },
            {
                path: "/login",
                element: <LoginPage />
            },
            {
                path: "/register",
                element: <RegisterPage />
            },
            {
                path: "/profile",
                element: <ProfilePage />     // Ska vara skyddad
            },
            {
                path: "*",
                element: <NotFoundPage />
            },
        ]
    }
])

export default router;