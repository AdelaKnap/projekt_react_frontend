import { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { ReviewInterface } from "../types/ReviewInterface";
import { useAuth } from "../context/AuthContext";
import * as Yup from "yup";
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
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    // Valideringsschema med yup
    const validationSchema = Yup.object({
        reviewText: Yup.string().trim().required("Recensionen får inte vara tom").min(5, "Texten måste vara minst 5 tecken lång."),
        rating: Yup.number().min(1, "Betyget måste vara minst 1.").max(5, "Betyget får vara max 5.").required("Du måste välja ett betyg"),
    });

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
            // Validering
            await validationSchema.validate(review, { abortEarly: false });

            setValidationErrors({});
            setError(null);
            setSuccess(null);

            const response = await fetch(`https://react-projektapi.onrender.com/reviews`, {
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
            if (err instanceof Yup.ValidationError) {
                const errors: { [key: string]: string } = {};
                err.inner.forEach((error) => {
                    errors[error.path || ""] = error.message;    // Lägg till felmeddelanden för varje input
                });

                setValidationErrors(errors);

            } else {
                console.error(err);
                setError("Något gick fel. Försök igen senare.");
            }
        }
    };

    return (
        <div className="container">
            
            <h1>Skriv recension</h1>

            <div className="form-container">
                <h2>Bok: {bookTitle}</h2>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <form className="reviewForm" onSubmit={submitForm}>
                    <label htmlFor="reviewText">Recension:</label>
                    <textarea id="reviewText" name="reviewText" value={reviewText} placeholder="Skriv din recension här..." onChange={(e) => setReviewText(e.target.value)} />

                    {validationErrors.reviewText && <p className="error">{validationErrors.reviewText}</p>}

                    <label htmlFor="rating">Sätt ett betyg, 1-5:</label>
                    <input type="number" id="rating" name="rating" value={rating} onChange={(e) => setRating(parseInt(e.target.value))} />

                    {validationErrors.rating && <p className="error">{validationErrors.rating}</p>}

                    <button type="submit">Spara</button>
                </form>

                <Link to="/">⬅ Tillbaka till startsidan</Link>

                <Link to="/profile">Till mina recensioner ➡</Link>
            </div>
        </div>
    );
};

export default ReviewForm;
