import { NavLink } from "react-router-dom";
import "../components/Header.css";
import { useAuth } from "../context/AuthContext";

const Header = () => {

    const { user, logout } = useAuth();

    return (
        <header>
            <nav>
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
                    <li>
                        {
                            // Om användaren inte är inloggad visas Logga in och annars Logga ut-knapp
                            !user ? <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>Logga in</NavLink> : <button onClick={logout}>Logga ut</button>
                        }
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
