import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

// Interface med props som är children
interface ProtectedRouteProps {
    children: ReactNode
}

// Komponent för att skydda sidor så att bara inloggade användare kommer åt dom
const ProtectedRoute : React.FC<ProtectedRouteProps> = ({ children }) => {

    // Hämta användaren från AuthContext
    const { user } = useAuth();

    // Om ingen inloggad, skicka till inloggningssidan
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Om användaren är inloggad, skicka till den skyddade sidan (children)
    return (
        <>
            {children}
        </>
    )

}

export default ProtectedRoute