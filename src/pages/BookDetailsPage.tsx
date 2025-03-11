import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BookInterface } from "../types/BookInterface";
import ReviewsList from "../components/ReviewsList";
import "./css/BookDetailsPage.css";

// Funktion för att ta bort html-taggar och tecken från beskrivningen
const cleanHtml = (html: string): string => {
    const text = new DOMParser().parseFromString(html, "text/html");
    return text.body.textContent || "";
};

const BookDetailsPage = () => {
    const { id } = useParams<{ id: string }>();                     // Hämta id från url:en
    const [book, setBook] = useState<BookInterface | null>(null);   // Bokdata
    const [error, setError] = useState<string | null>(null);        // Felmeddelanden

    useEffect(() => {
        if (id) {
            getBook(id);  // Hämta bokdetaljer
        }
    }, [id]);

    // Funktion för att hämta böcker
    const getBook = async (bookId: string) => {
        try {
            setError(null); // Nollställ tidigare felmeddelande

            const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);

            // Om response inte är ok, kasta ett fel
            if (!response.ok) {
                throw new Error("Något gick fel vid hämtning av boken.");
            }

            const data = await response.json();
            if (!data.volumeInfo) {
                throw new Error("Boken hittades inte.");
            }

            // Rensa html i description
            const cleanDescription = cleanHtml(data.volumeInfo.description || "Tyvärr, ingen beskrivning hittades.");

            setBook({ ...data, volumeInfo: { ...data.volumeInfo, description: cleanDescription } });

        } catch (error) {
            console.error(error);
            setError("Något gick fel vid hämtning av boken."); // Felhantering
        }
    };

    return (
        <>
            <div className="container">

                <h1>Mer om boken</h1>

                {error && <p className="errorMess">{error}</p>} {/* Visa felmeddelande om det finns */}

                {book && book.volumeInfo && ( // All relevant info ligger under volumeInfo
                    <section className="book-details">

                        <h2>{book.volumeInfo.title}</h2>

                        {book.volumeInfo.imageLinks?.thumbnail && (
                            <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
                        )}
                        <p><strong>Författare:</strong> {book.volumeInfo.authors?.join(", ") || "Okänd författare"}</p>
                        <p><strong>Beskrivning:</strong> {book.volumeInfo.description || "Ingen beskrivning finns."}</p>

                        <Link to="/">⬅ Tillbaka till startsidan</Link>

                        {/* Länk till reviewform-sidan */}
                        <Link
                            to={`/reviewform/${book.id}`} state={{ title: book.volumeInfo.title }} className="review-link">
                            <i className="fa-solid fa-pen-to-square"></i> Skriv recension (Kräver inloggning)
                        </Link>


                        {/* ReviewsList-komponenten för recensionerna */}
                        <ReviewsList bookId={id || ""} />
                    </section>
                )}

            </div>
        </>
    );
};

export default BookDetailsPage;
