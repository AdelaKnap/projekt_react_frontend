import { useEffect, useState } from "react";
import { ReviewInterface } from "../types/ReviewInterface";
import "../components/ReviewList.css";

interface ReviewsListProps {
    bookId: string; // bookId som en prop
}

const ReviewsList = ({ bookId }: ReviewsListProps) => {
    const [reviews, setReviews] = useState<ReviewInterface[]>([]); // Recensioner
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Hämta recensioner
        const getReviews = async () => {
            try {

                setLoading(true);

                const response = await fetch(`https://react-projektapi.onrender.com/reviews?bookId=${bookId}`);

                // Om ingen recension finns (404-not found), sätt tom array
                if (response.status === 404) {
                    setReviews([]);
                    return;
                }

                if (!response.ok) {
                    throw new Error("Något gick fel vid hämtning av recensionen.");
                }

                // Sätt recensionerna i state
                const data = await response.json();
                setReviews(data);

            } catch (error) {
                console.error(error);
                setError("Något gick fel vid hämtning av recensionerna.");
            } finally {
                setLoading(false);
            }
        };

        getReviews();
    }, [bookId]); // Kör när bookId ändras

    return (
        <>
            <h3>Recensioner</h3>

            {/* Laddningsmeddelande */}
            {loading && (
                <div className="fetchInfo">
                    <span className="loading-spinner"></span>
                    <p><em>Hämtar recensioner...</em></p>
                </div>
            )}

            {/* Felmeddelande */}
            {error && !loading && <p className="errorMess">{error}</p>}

            {/* Om inga recensioner visa ett meddelande */}
            {reviews.length === 0 ? (
                <p>Det finns inga recensioner än!</p>
            ) : (
                <div className="reviews-section">
                    {/* Loopar genom recensionerna */}
                    {reviews.map((review) => (
                        <div key={review._id} className="bookReview">
                            <p><strong>Av:</strong> {review.userId?.username}, {review.created ? new Date(review.created).toLocaleDateString() : ""}</p>
                            <p>{review.reviewText}</p>
                            <p><strong>Betyg:</strong> {review.rating} / 5</p>
                        </div>
                    ))}
                </div>
            )}
        </>

    );
};

export default ReviewsList;
