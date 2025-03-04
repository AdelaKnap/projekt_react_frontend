import { useEffect, useState } from "react";
import { BookInterface } from "../types/BookInterface";
import "../components/BookList.css";

// Sätt böcker i genre mysterier som default
const default_query = "subject:mystery";

// Funktion för att hämta böcker från Google Books API, med 40 böcker i resultatet (som är max-antalet)
const fetchBooks = async (query: string, maxResults: number = 40, startIndex: number = 0): Promise<BookInterface[]> => {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&startIndex=${startIndex}`);
        const data = await response.json();

        return data.items || [];  
    } catch (error) {
        console.error("Fel vid hämtning av böcker:", error);
        return [];
    }
};

// BookList-komponenten som tar emot en query som prop
const BookList = ({ query }: { query: string }) => {

    // State för böcker
    const [books, setBooks] = useState<BookInterface[]>([]);

    // useEffect 
    useEffect(() => {
        const getBooks = async () => {
            const searchQuery = query.trim() ? query : default_query;       // Använd default_query om sökfältet är tomt
            const fetchedBooks = await fetchBooks(searchQuery);
            setBooks(fetchedBooks);
        };

        getBooks();
    }, [query]);

    return (
        <div className="book-list">
            {books.length > 0 ? (        // Kontroll om böcker finns
                books.map((book) => (
                    <div className="book-card" key={book.id}>
                        {book.volumeInfo.imageLinks?.thumbnail && (    // Bild, om det finns
                            <img
                                className="book-image"
                                src={book.volumeInfo.imageLinks.thumbnail}
                                alt={book.volumeInfo.title}
                            />
                        )}
                        <div className="book-info">
                            <h3 className="book-title">{book.volumeInfo.title}</h3>
                            <p className="book-authors">{book.volumeInfo.authors?.join(", ") || "Okänd författare"}</p>
                        </div>
                    </div>
                ))
            ) : (
                // Om inga böcker hittades, visa ett meddelande
                <p>Inga böcker hittades.</p>
            )}
        </div>
    );
};

export default BookList;
