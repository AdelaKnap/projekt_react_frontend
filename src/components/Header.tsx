import { NavLink } from "react-router-dom";
import "../components/Header.css";

const Header = () => {

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
                        <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
                            Logga in
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
