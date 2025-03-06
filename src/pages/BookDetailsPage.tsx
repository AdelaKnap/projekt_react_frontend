import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BookInterface } from "../types/BookInterface";
import { ReviewInterface } from "../types/ReviewInterface";
import "./css/BookDetailsPage.css";

// Funktion för att ta bort html från beskrivningen
const cleanHtml = (html: string): string => {
    const text = new DOMParser().parseFromString(html, "text/html");
    return text.body.textContent || "";
};

const BookDetailsPage = () => {

    // States
    const { id } = useParams<{ id: string }>();      // Hämta id från url:en
    const [book, setBook] = useState<BookInterface | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<ReviewInterface[]>([]);

    // useEffect för att hämta bokinfo
    useEffect(() => {
        if (id) {
            getBook(id);  // Hämta bokdetaljer
            getReviews(id);  // Hämta recensioner för boken
        }
    }, [id]);

    // Funktion för att hämta böcker
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

            // Rensa html i description
            const cleanDescription = cleanHtml(data.volumeInfo.description || "Tyvärr, ingen beskrivning hittades.");

            setBook({ ...data, volumeInfo: { ...data.volumeInfo, description: cleanDescription } });

        } catch (error) {
            console.error(error);
            setError("Något gick fel vid hämtning av boken.");
        }
    };

    // Hämta recensioner
    const getReviews = async (bookId: string) => {
        try {
            const response = await fetch(`http://localhost:3000/reviews?bookId=${bookId}`);

            if (!response.ok) {
                throw new Error("Något gick fel vid hämtning av recensionerna.");
            }
            const data = await response.json();
            setReviews(data);       // recensionerna i state

        } catch (error) {
            console.error(error);
            setError("Något gick fel vid hämtning av recensionerna.");
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

                    {/* Länk till reviewform-sidan */}
                    <Link
                        to={`/reviewform/${book.id}`} state={{ title: book.volumeInfo.title }} className="review-link">
                        Skriv recension (Kräver inloggning)
                    </Link>

                    {/* Visa recensioner */}
                    <div className="reviews-section">
                        <h3>Recensioner</h3>
                        {reviews.length === 0 ? (
                            <p>Det finns inga recensioner än!</p>
                        ) : (
                            <ul>
                                {reviews.map((review) => (
                                    <div key={review._id}>
                                        <p><strong>Recension:</strong> {review.reviewText}</p>
                                        <p><strong>Betyg:</strong> {review.rating}</p>
                                    </div>
                                ))}

                            </ul>
                        )}
                    </div>
                </div>

            )}


        </>
    );
};

export default BookDetailsPage;
