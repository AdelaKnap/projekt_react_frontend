import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ValidationNewUserInterface } from "../types/ValidationNewUserInterface";
import * as Yup from "yup";
import "./css/CreateUserPage.css";

const CreateUserPage = () => {

    // States
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<ValidationNewUserInterface>({})
    const [serverError, setServerError] = useState("");
    const navigate = useNavigate();

    // Valideringsschema med yup
    const validationSchema = Yup.object({
        username: Yup.string().min(4, "Användarnamnet behöver vara minst 4 tecken.").max(20, "Max 20 tecken").required("Du behöver ange ett användarnamn."),
        password: Yup.string().min(4, "Lösenordet behöver vara minst 4 tecken").max(20, "Max 20 tecken").required("Du behöver ange ett lösenord.")
    });

    // Funktion för att skapa en ny användare
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = { username, password };

        try {
            // Validera input med Yup
            await validationSchema.validate(user, { abortEarly: false });

            // Ta bort eventuella felmeddelanden sen tidigare
            setErrors({});
            setServerError("");

            // Post-anrop för att skapa användare
            const response = await fetch(`http://localhost:3000/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
                credentials: "include"
            });

            const data = await response.json();
            if (!response.ok) {

                // Om användarnamnet är upptaget
                if (data.message === "Användarnamnet är upptaget. Välj ett annat användarnamn.") {
                    setErrors({ username: data.message });

                    return;
                }
                throw new Error(data.message || "Registrering misslyckades");
            }

            alert("Användare skapad! Du kan nu logga in med ditt användarnamn och lösenord.");

            // Töm formuläret
            setUsername("");
            setPassword("");

            // Skicka användaren till login-sidan
            navigate("/login");

        } catch (error) {
            const validationErrors: ValidationNewUserInterface = {};

            if (error instanceof Yup.ValidationError) {
                error.inner.forEach((error) => {
                    const prop = error.path as keyof ValidationNewUserInterface;
                    validationErrors[prop] = error.message;         // Lägg till felmeddelanden för varje input
                });

                setErrors(validationErrors);     // Uppdatera state med felmeddelandena
            }
        }
    };

    return (
        <>
            <div className="container">

                <h1>Ny användare</h1>

                <div className="login-container">
                    <h2>Skapa ny användare</h2>
                    <p>Ange ett användarnamn och ett lösenord</p>

                    {serverError && <div className="errMess">{serverError}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <input type="text" placeholder="Användarnamn" value={username} onChange={(e) => setUsername(e.target.value)} />

                        {errors.username && <span className="errMess">{errors.username}</span>}

                        <input type="password" placeholder="Lösenord" value={password} onChange={(e) => setPassword(e.target.value)} />

                        {errors.password && <span className="errMess">{errors.password}</span>}

                        <button type="submit">Skapa användare</button>
                    </form>

                </div>

            </div>
        </>
    );
};

export default CreateUserPage;
