import { useState } from "react";
import BookList from "../components/BookList";
import "./css/HomePage.css";

const HomePage = () => {
    const [search, setSearch] = useState(""); // För sök-fras
    const [genre, setGenre] = useState("mystery"); // Förvalt genre

    // Lista med genrer
    const genres = ["Mystery", "Fantasy", "History", "Fiction", "Romance"];

    // Funktion för dropdown
    const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setGenre(event.target.value);
    };

    return (
        <>
            <div className="container">

                <h1>Böcker</h1>

                {/* Sökformulär */}
                <form className="search-form">
                    <label htmlFor="search"></label>
                    <input type="text" placeholder="Sök efter bok/författare..." value={search} onChange={(event) => setSearch(event.target.value)} />
                </form>

                {/* Dropdown */}
                <div className="genre">
                    <label htmlFor="genre">Välj kategori:</label>
                    <select id="genre" value={genre} onChange={handleGenreChange}>
                        {/* Loopa genom listan och skapar ett alternativ för varje val */}
                        {genres.map((g) => (
                            <option key={g} value={g}> {g} </option>
                        ))}
                    </select>
                </div>

                {/* Skicka med sökfras eller genre som prop */}
                <BookList query={search || `subject:${genre}`} />
            </div>
        </>
    );
};

export default HomePage;
