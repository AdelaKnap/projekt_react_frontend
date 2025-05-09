import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import BookDetailsPage from "./pages/BookDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ReviewFormPage from "./pages/ReviewFormPage";
import CreateUserPage from "./pages/CreateUserPage";

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
                path: "/create-user",
                element: <CreateUserPage />
            },
            {
                path: "/profile/:bookId?",
                element: (
                    <ProtectedRoute>
                        <ProfilePage />     
                    </ProtectedRoute>
                )
            },
            {
                path: "/reviewform/:bookId?",
                element: (
                    <ProtectedRoute>
                        <ReviewFormPage />     
                    </ProtectedRoute>
                )
            },
            {
                path: "*",
                element: <NotFoundPage />
            },
        ]
    }
])

export default router;