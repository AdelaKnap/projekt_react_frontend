import { useState } from "react";
import { ReviewInterface } from "../types/ReviewInterface";

const Reviews = () => {

    // States
    const [review] = useState<ReviewInterface>({
        reviewText: "",
        rating: 0
    });

    // Submit från formuläret
    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        // Anrop här
    }

    // Sidinnehållet
    return (
        <form className="reviewForm" onSubmit={submitForm}>
            <label htmlFor="reviewtext">Recension:</label>
            <input type="text" id="reviewText" name="reviewText" value={review.reviewText} placeholder="Skriv din recension här..." />

            <label htmlFor="rating">Sätt ett betyg, 1-5:</label>
            <input type="number" id="rating" name="rating" value={review.rating} placeholder="Betyg" />

            <button type="submit">Spara</button>

        </form>
    )
}

export default Reviews

// Formulär för att skriva en recension, create

// Översikt över existernade recensioner med delete, update 