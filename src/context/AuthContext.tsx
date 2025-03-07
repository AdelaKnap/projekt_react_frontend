import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User, LoginCredentials, AuthResponse, AuthContextType } from "../types/auth.types";

// Skapa Context för autentisering
const AuthContext = createContext<AuthContextType | null>(null);

// Interface för props som används i AuthProvider
interface AuthProviderProps {
    children: ReactNode;
}

// AuthProvider för autentisering, sätter värdena till AuthContext
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const [user, setUser] = useState<User | null>(null);

    // Funktion för logga in
    const login = async (credentials: LoginCredentials): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:3000/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials),
                credentials: "include"              // Skickar med cookies
            });

            if (!response.ok) throw new Error("Misslyckad inloggning");

            // Om ok inlogg hämta användardata från responsen
            const data = await response.json() as AuthResponse;
            console.log("Inloggningsdata:", data);

            if (data.user) {
                // Sätt användaren i state
                setUser(data.user);
            } else {
                console.error("Inloggning misslyckades: Ingen användardata");
                throw new Error("Inloggning misslyckades");
            }
        } catch (error) {
            console.error("Inloggning misslyckades:", error);
            throw new Error("Inloggning misslyckades");
        }
    };

    // Funktion för att hämta inloggad användare för att inte behöva logga in på nytt vid sidomladdning
    const checkUser = async () => {
        try {
            const response = await fetch(`http://localhost:3000/users/checkSession`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Ingen session hittades");

            const data = await response.json();

            setUser(data.user.user || data.user);

        } catch (error) {
            console.error("Fel vid kontroll av cookie/session:", error);
            setUser(null);
        }
    };

    // Kör chechUser av session vid laddning
    useEffect(() => {
        checkUser();
    }, []);

    // Funktion för att logga ut
    const logout = async () => {
        try {
            const response = await fetch(`http://localhost:3000/users/logout`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Misslyckades att logga ut");

            localStorage.removeItem("userId");
            setUser(null);

        } catch (error) {
            console.error("Fel vid utloggning:", error);
        }
    };


    return (
        // Providern sätter värdena till child-komponenterna
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook för att använda authContexten 
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth måste användas inom en provider");
    }

    return context;
};
