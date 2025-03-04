import { useState } from "react";
import BookList from "../components/BookList";
import "./css/HomePage.css";

const HomePage = () => {
    const [search, setSearch] = useState("");

    return (
        <div>
            <h1>Böcker</h1>

            {/* Sökformulär */}
            <form className="search-form">
                <label htmlFor="search"></label>
                <input type="text" placeholder="Sök efter bok/författare..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </form>

            {/* Skicka med sökfras som prop och annars mysteri-genre */}
            <BookList query={search || "subject:mystery"} />
        </div>
    );
};

export default HomePage;
