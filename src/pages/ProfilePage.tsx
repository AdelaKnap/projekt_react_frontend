import { useEffect, useState } from "react";
import { ReviewInterface } from "../types/ReviewInterface";


const ProfilePage = () => {

    // States
    const [reviews, setReviews] = useState<ReviewInterface[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [handleReview, setHandleReview] = useState<ReviewInterface | null>(null);
    const [updatedText, setUpdatedText] = useState<string>("");
    const [updatedRating, setUpdatedRating] = useState<number>(0);

    // useEffect
    useEffect(() => {
        fetchReviews();
    }, []);

    // Fubktion för att hämta recensioner
    const fetchReviews = async () => {
        try {
            const response = await fetch("http://localhost:3000/reviews/user", {
                method: "GET",
                credentials: "include"
            });

            if (response.status === 404) {
                setReviews([]);    // Tom array om inga recensioner
                return;
            }

            if (!response.ok) {
                throw new Error("Kunde inte hämta recensionerna.");
            }

            const data = await response.json();
            console.log(data);

            setReviews(data);
        } catch (error) {
            console.error(error);
            setError("Ett fel uppstod vid hämtning av recensionerna.");
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
            console.error(error);
            setError("Ett fel uppstod vid uppdatering av recensionen.");
        }
    };

    return (
        <div className="profile-container">

            <h2>Mina recensioner</h2>

            {/* Felmeddelande */}
            {error && <p className="error">{error}</p>}

            {/* Om inga recensioner visa ett meddelande */}
            {reviews.length === 0 ? (
                <p>Du har inga recensioner ännu.</p>
            ) : (
                reviews.map((review) => {
                    // Om en recension ska redigeras
                    const isEditing = handleReview?._id === review._id;

                    return (
                        <div key={review._id} className="review-card">

                            <h3>{review.bookTitle}</h3>

                            {/* Ej redigering, "visningsläge" */}
                            {!isEditing && (
                                <div>
                                    <p>{review.reviewText}</p>
                                    <p>Betyg: {review.rating}/5</p>
                                    <p>Datum: {new Date(review.created!).toLocaleDateString()}</p>

                                    {/* Redigera-knapp */}
                                    <button onClick={() => {
                                        setHandleReview(review);
                                        setUpdatedText(review.reviewText);
                                        setUpdatedRating(review.rating);
                                    }}> Redigera </button>

                                    {/* Delete-knapp */}
                                    <button onClick={() => handleDelete(review._id ?? "")}>Radera</button>
                                </div>
                            )}

                            {/* Om "redigeringsläge" */}
                            {isEditing && (
                                <div className="edit-form">
                                    <textarea value={updatedText} onChange={(e) => setUpdatedText(e.target.value)} />
                                    <input type="number" min="1" max="5" value={updatedRating} onChange={(e) => setUpdatedRating(Number(e.target.value))} />

                                    <button onClick={() => review._id && handleUpdate(review._id)}>Spara</button>
                                    <button onClick={() => setHandleReview(null)}>Avbryt</button>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );

};

export default ProfilePage;
