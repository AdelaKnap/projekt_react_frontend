import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./css/LoginPage.css";

const LoginPage = () => {

    // States
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // login-funktionen och användaren från AuthContext
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Om användaren redan är inloggad, skicka till profilsidan
    useEffect(() => {
        if (user) {
            navigate("/profile");
        }
    }, [user, navigate]);

    // Submit för fomuläret
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);    // Laddningsmeddelande 

            await login({ username, password });   // login-funktionen från AuthContext
            navigate("/profile");                  // Till profilsidan vid lyckad inloggning


        } catch (error) {
            console.error("Inloggning misslyckades...:", error);
            setError("Inloggningen misslyckades, testa igen.")
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container">

                <h1>Logga in</h1>

                <div className="login-container">

                    <h2>Inloggningsuppgifter</h2>

                    <form onSubmit={handleSubmit} className="login-form">

                        {/* Laddningsmeddelande */}
                        {loading && (
                            <div className="fetchInfo">
                                <span className="loading-spinner"></span>
                                <p><em>Du loggas in...</em></p>
                            </div>
                        )}

                        {error && (
                            <div className="errorMessage">{error}</div>
                        )}

                        <input type="text" placeholder="Användarnamn" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" placeholder="Lösenord" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit"><i className="fa-solid fa-right-to-bracket"></i> Logga in</button>

                        <p><Link to="/create-user">Skapa ny användare här</Link></p>

                    </form>
                </div>

            </div>
        </>
    );
};

export default LoginPage;
