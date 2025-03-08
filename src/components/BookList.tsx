import { useEffect, useState, useCallback } from "react";
import { BookInterface } from "../types/BookInterface";
import { Link } from "react-router-dom";
import "../components/BookList.css";

// Standardvärden för query och max-resultat per sida
const defaultQuery = "subject:mystery";
const maxResult = 40;

// Funktion för att sätta ihop url
const buildUrl = (query: string, startIndex: number): string => {

    const baseUrl = 'https://www.googleapis.com/books/v1/volumes';
    const url = `${baseUrl}?q=${query}&maxResults=${maxResult}&startIndex=${startIndex}`;

    return url;  // Den sammansatta sökvägen
};

// Funktion för att hämta böcker från google books
const fetchBooks = async (query: string, startIndex: number) => {

    try {
        const apiUrl = buildUrl(query, startIndex);

        // Fetch-anrop
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Något gick fel vid hämtning av böcker.");
        }

        return await response.json();

    } catch (error) {
        console.error("Fel vid hämtning av böcker:", error);
        return { items: [], totalItems: 0 };    // returnera tom array och 0 böcker 
    }
};

// BookList-komponenten med böcker och paginering
const BookList = ({ query }: { query: string }) => {

    // States för böcker och sidor
    const [books, setBooks] = useState<BookInterface[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    // useCallback för att hämta böcker baserat på query och currentPage
    const getBooks = useCallback(async () => {

        const searchQuery = query.trim() || defaultQuery;
        const startIndex = currentPage * maxResult;                  // startIndex utifrån aktuell sida för att få rätt antal böcker

        // Fetch-anrop för böcker
        const { items, totalItems } = await fetchBooks(searchQuery, startIndex);

        setBooks(items);                                             // Uppdatera state med nya böcker
        setTotalPages(Math.ceil(totalItems / maxResult));            // Antalet sidor utifrån totala antalet böcker och maxResult

    }, [query, currentPage]);                                        // Kör när query eller currentPage ändras

    // UseEffect, nollställ sidan när query ändras
    useEffect(() => {
        setCurrentPage(0);
    }, [query]);

    // Hämtar böcker när query eller currentPage ändras
    useEffect(() => {
        getBooks();
    }, [getBooks]);

    // Funktion för att ändra sida
    const changePage = (direction: number) => {
        setCurrentPage((prev) => {
            const newPage = prev + direction;
            return Math.min(Math.max(newPage, 0), totalPages - 1);
        });
    };

    return (
        <div>
            {/* Lista böcker */}
            <div className="book-list">
                {books.length ? (
                    books.map((book) => (
                        <Link to={`/book/${book.id}`} key={book.id} className="book-card">
                            {book.volumeInfo.imageLinks?.thumbnail && (
                                <img className="book-image" src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
                            )}
                            <div className="book-info">
                                <h3 className="book-title">{book.volumeInfo.title}</h3>
                                <p className="book-authors">{book.volumeInfo.authors?.join(", ") || "Okänd författare"}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>Inga böcker hittades.</p>
                )}
            </div>

            {/* Paginering */}
            <div className="pagination">
                <button onClick={() => changePage(-1)} disabled={currentPage === 0}>Föregående</button>
                <span>Sida {currentPage + 1} av {totalPages}</span>
                <button onClick={() => changePage(1)} disabled={currentPage === totalPages - 1}>Nästa</button>
            </div>
        </div>
    );
};

export default BookList;
