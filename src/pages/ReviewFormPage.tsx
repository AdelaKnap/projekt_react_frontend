import { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { ReviewInterface } from "../types/ReviewInterface";
import { useAuth } from "../context/AuthContext";
import "./css/ReviewFormPage.css";

const ReviewForm = () => {
    // Hämtar bookId från URL:en
    const { bookId } = useParams<{ bookId: string }>();

    // Hämtar state från länken (titel)
    const { state } = useLocation() as { state: { title: string } };
    const bookTitle = state?.title || "Boktitel saknas";

    // Hämtar användardata från auth-contexten
    const { user } = useAuth();

    // States
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user?._id) {
            setError("Du måste vara inloggad för att lämna en recension.");
            return;
        }

        // Objektet som ska skickas
        const review: ReviewInterface = {
            bookId: bookId || "",
            bookTitle: bookTitle,
            reviewText,
            rating
        };

        try {
            setError(null);
            setSuccess(null);

            const response = await fetch("http://localhost:3000/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ ...review, userId: user._id }),
            });

            if (!response.ok) {
                throw new Error("Misslyckades att lägga till recension");
            }

            setSuccess("Recensionen sparades!");
            // Rensa formuläret
            setReviewText("");
            setRating(1);

        } catch (err) {
            console.error(err);
            setError("Något gick fel. Försök igen senare.");
        }
    };

    return (
        <section className="form-container">
            <h1>Skriv recension</h1>
            <h2>Bok: {bookTitle}</h2>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <form className="reviewForm" onSubmit={submitForm}>
                <label htmlFor="reviewText">Recension:</label>
                <textarea id="reviewText" name="reviewText" value={reviewText} placeholder="Skriv din recension här..." onChange={(e) => setReviewText(e.target.value)} />

                <label htmlFor="rating">Sätt ett betyg, 1-5:</label>
                <input type="number" id="rating" name="rating" value={rating} onChange={(e) => setRating(parseInt(e.target.value))} min={1} max={5} />

                <button type="submit">Spara</button>
            </form>

            <Link to="/">⬅ Tillbaka till startsidan</Link>

            <Link to="/profile">Till mina recensioner ➡</Link>
        </section>
    );
};

export default ReviewForm;
