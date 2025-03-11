import { useEffect, useState } from "react";
import { ReviewInterface } from "../types/ReviewInterface";
import * as Yup from "yup";
import "./css/ProfilePage.css";

const ProfilePage = () => {

    // States
    const [reviews, setReviews] = useState<ReviewInterface[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [handleReview, setHandleReview] = useState<ReviewInterface | null>(null);
    const [updatedText, setUpdatedText] = useState<string>("");
    const [updatedRating, setUpdatedRating] = useState<number>(0);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    // useEffect
    useEffect(() => {
        fetchReviews();
    }, []);

    // Fubktion för att hämta recensioner
    const fetchReviews = async () => {
        try {

            setLoading(true);
            setError(null);

            const response = await fetch("http://localhost:3000/reviews/user", {
                method: "GET",
                credentials: "include"
            });

            if (response.status === 404) {
                setReviews([]);    // Tom array om inga recensioner
                return;
            }

            if (!response.ok) {
                throw new Error("Något gick fel, kunde inte hämta recensionerna.");
            }

            const data = await response.json();
            setReviews(data);

        } catch (error) {
            console.error(error);
            setError("Ett fel uppstod vid hämtning av recensionerna.");
        } finally {
            setLoading(false);
        }
    };

    // Funktion för att ta bort recension
    const handleDelete = async (id: string) => {

        if (!window.confirm("Är du säker på att du vill ta bort recensionen?")) return;

        try {
            const response = await fetch(`http://localhost:3000/reviews/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) throw Error("Raderingen misslycakdes");

            // Ta bort recension genom att filtrera mot matchande id och uppdatera state
            setReviews(reviews.filter((rev) => rev._id !== id));

        } catch (error) {
            console.error(error);
            setError("Ett fel uppstod vid borttagning av recensionen.");
        }
    };

    // Valideringsschema med Yup
    const validationSchema = Yup.object({
        reviewText: Yup.string().trim().required("Recensionen får inte vara tom").min(5, "Texten måste vara minst 5 tecken lång."),
        rating: Yup.number().min(1, "Betyget måste vara minst 1.").max(5, "Betyget får vara max 5.").required("Du måste välja ett betyg"),
    });

    // Uppdatera recension
    const handleUpdate = async (id: string) => {
        try {
            if (!handleReview) return;

            // Skapa ett objekt med det som behövs
            const reviewData = {
                bookId: handleReview.bookId,
                bookTitle: handleReview.bookTitle,
                userId: handleReview.userId,
                reviewText: updatedText,
                rating: updatedRating
            };

            // Validera innan PUT
            await validationSchema.validate(reviewData, { abortEarly: false });

            setValidationErrors({});
            setError(null);

            // PUT-anrop
            const response = await fetch(`http://localhost:3000/reviews/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(reviewData),
            });

            if (!response.ok) {
                throw new Error("Kunde inte uppdatera recensionen.");
            }

            const updatedReview = await response.json();  // Uppdaterad recension

            // Uppdatera recensionen i listan med setReviews baserat på id
            setReviews(reviews.map((rev) => (rev._id === id ? updatedReview : rev)));
            setHandleReview(null);          // För att avbryta redigering
            setUpdatedText("");             // Rensa textfält
            setUpdatedRating(1);            // Sätt betyg till 1

        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors: { [key: string]: string } = {};
                error.inner.forEach((err) => {
                    errors[err.path || ""] = err.message;   // Lägg till felmeddelanden för varje input
                });

                setValidationErrors(errors);

            } else {
                console.error(error);
                setError("Ett fel uppstod vid uppdatering av recensionen.");
            }
        }
    };

    return (
        <div className="container">

            <h1>Mina recensioner</h1>

            {loading && (
                <div className="fetchInfo">
                    <span className="loading-spinner"></span>
                    <p><em>Hämtar recensioner...</em></p>
                </div>
            )}

            {/* Felmeddelande */}
            {error && <p className="error">{error}</p>}

            <section className="profile-container">

                {/* Om inga recensioner visa ett meddelande */}
                {reviews.length === 0 && !error ? (
                    <p>Du har inga recensioner ännu.</p>
                ) : (
                    reviews.map((review) => {
                        // Om en recension ska redigeras
                        const isEditing = handleReview?._id === review._id;

                        return (
                            <div key={review._id} className="review-card">

                                <h2>{review.bookTitle}</h2>

                                {/* "Visningsläge" */}
                                {!isEditing && (
                                    <div>
                                        <p>{review.reviewText}</p>
                                        <p><strong>Betyg:</strong> {review.rating}/5</p>
                                        <p><strong>Datum:</strong> {new Date(review.created!).toLocaleDateString()}</p>

                                        {/* Redigera-knapp */}
                                        <button className="editBtn" onClick={() => {
                                            setHandleReview(review);
                                            setUpdatedText(review.reviewText);
                                            setUpdatedRating(review.rating);
                                        }}> <i className="fa-solid fa-pen"></i> Redigera</button>

                                        {/* Delete-knapp */}
                                        <button className="deleteBtn" onClick={() => handleDelete(review._id ?? "")}> <i className="fa-solid fa-trash"></i> Radera</button>
                                    </div>
                                )}

                                {/* Om "redigeringsläge" */}
                                {isEditing && (
                                    <form className="edit-form" onSubmit={(e) => {
                                        e.preventDefault();
                                        if (review._id) handleUpdate(review._id);
                                    }}>
                                        <label htmlFor="reviewText">Recension:</label>
                                        <textarea id="reviewText" name="reviewText" value={updatedText} onChange={(e) => setUpdatedText(e.target.value)} />
                                        {validationErrors.reviewText && <p className="error">{validationErrors.reviewText}</p>}

                                        <label htmlFor="rating">Sätt ett betyg, 1-5:</label>
                                        <input type="number" id="rating" name="rating" value={updatedRating} onChange={(e) => setUpdatedRating(Number(e.target.value))} />
                                        {validationErrors.rating && <p className="error">{validationErrors.rating}</p>}

                                        <button type="submit">Spara</button>
                                        <button type="button" onClick={() => setHandleReview(null)}>Avbryt</button>
                                    </form>
                                )}
                            </div>
                        );
                    })
                )}
            </section>
        </div>
    );

};

export default ProfilePage;
