import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BookInterface } from "../types/BookInterface";

// Hämta id från url:en
const BookDetailsPage = () => {
    const { id } = useParams<{ id: string }>();

    // States
    const [book, setBook] = useState<BookInterface | null>(null);
    const [error, setError] = useState<string | null>(null);

    // useEffect för att hämta bokinfo
    useEffect(() => {
        if (id) {
            getBook(id);
        }
    }, [id]);

    // Hämta bok 
    const getBook = async (bookId: string) => {
        try {

            setError(null);

            const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);

            if (!response.ok) {
                throw new Error("Något gick fel vid hämtning av boken.");
            }

            const data = await response.json();
            if (!data.volumeInfo) {                
                throw new Error("Boken hittades inte.");
            }

            setBook(data);  

        } catch (error) {
            console.error(error);
            setError("Något gick fel vid hämtning av boken.");
        }
    };

    return (
        <>
            <h1>Detaljer om boken</h1>

            {error && <p className="errorMess">{error}</p>}

            {book && book.volumeInfo && (       // All relevant info ligger under volumeInfo
                <div className="book-details">
                    <h2>{book.volumeInfo.title}</h2>
                    {book.volumeInfo.imageLinks?.thumbnail && (
                        <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
                    )}
                    <p><strong>Författare:</strong> {book.volumeInfo.authors?.join(", ") || "Okänd författare"}</p>
                    <p><strong>Beskrivning:</strong> {book.volumeInfo.description || "Ingen beskrivning finns."}</p>

                    <Link to="/">⬅ Tillbaka till startsidan</Link>
                </div>

            )}


        </>
    );
};

export default BookDetailsPage;
