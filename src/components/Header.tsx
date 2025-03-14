import { NavLink } from "react-router-dom";
import "../components/Header.css";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const Header = () => {

    const { user, logout } = useAuth();

    return (
        <>
            <header>
                <nav>
                    <NavLink to="/">
                        <img src={logo} alt="Logotyp med två böcker" className="logo" />
                    </NavLink>
                    <ul>
                        <li>
                            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                                Hem
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
                                Mina recensioner
                            </NavLink>
                        </li>
                    </ul>

                    <div className="auth-link">
                        {
                            // Om användaren inte är inloggad visas Logga in och annars Logga ut-knapp
                            !user ? <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}><i className="fa-solid fa-right-to-bracket"></i> Logga in</NavLink>
                                : <button onClick={logout}><i className="fa-solid fa-right-from-bracket"></i> Logga ut</button>
                        }
                    </div>

                </nav>
            </header>

            <img id="banner" src="/books.jpg" alt="Bannerbild på böcker" />
        </>

    );
};

export default Header;
