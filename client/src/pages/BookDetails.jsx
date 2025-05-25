import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../UserContext";

function BookDetail() {
  const { id } = useParams();
  const { user } = useUser();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  // Reset on book change
  useEffect(() => {
    setPage(1);
    setReviews([]);
    setHasMore(true);
  }, [id]);

  // Load Book Details
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);

    fetch(`http://localhost:5000/books/${id}`)
      .then((res) => res.json())
      .then(setBook);
  }, [id]);

  // Load Reviews with Pagination
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/reviews?bookId=${id}&page=${page}`)
      .then((res) => res.json())
      .then((newReviews) => {
        if (newReviews.length === 0) {
          setHasMore(false);
        } else {
          setReviews((prev) => {
            const existingIds = new Set(prev.map((r) => r._id));
            const uniqueReviews = newReviews.filter(
              (r) => !existingIds.has(r._id)
            );
            return [...prev, ...uniqueReviews];
          });
        }
      });
  }, [id, page]);

  const handleReviewSubmit = async () => {
    if (!token) {
      alert("You gotta log in first, bitch!");
      return;
    }
    const res = await fetch("http://localhost:5000/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        book: id,
        rating: newReview.rating,
        comment: newReview.comment,
        user: user._id,
      }),
    });
    const data = await res.json();
    setReviews((prev) => [data, ...prev]);
    setNewReview({ rating: 5, comment: "" });
  };

  const deleteReview = async (reviewId) => {
    if (!token) {
      alert("You gotta log in first, bitch!");
      return;
    }
    await fetch(`http://localhost:5000/reviews/${reviewId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setReviews((prev) => prev.filter((r) => r._id !== reviewId));
  };

  return (
    book && (
      <div className="container mt-4">
        <img src={book.coverImage} alt="cover" style={{ maxWidth: "300px" }} />
        <h2>{book.title}</h2>
        <h4>by {book.author}</h4>
        <p>Average Rating: {book.averageRating.toFixed(1)}</p>

        <div className="my-4 p-3 border rounded bg-light">
          <h5 className="mb-3">Write a Review</h5>

          <div className="mb-3">
            <label htmlFor="reviewComment" className="form-label">
              Your Comment
            </label>
            <textarea
              id="reviewComment"
              className="form-control"
              rows={3}
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              placeholder="Type your thoughts..."
            />
          </div>

          <div className="mb-3">
            <label htmlFor="reviewRating" className="form-label">
              Rating
            </label>
            <select
              id="reviewRating"
              className="form-select"
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: parseInt(e.target.value) })
              }
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "star" : "stars"}
                </option>
              ))}
            </select>
          </div>

          <div className="d-grid d-sm-flex justify-content-sm-end">
            <button
              className="btn btn-primary mt-2"
              onClick={handleReviewSubmit}
            >
              Submit Review
            </button>
          </div>
        </div>

        <div className="mt-5">
          <h5>Reviews</h5>
          {reviews.map((review, index) => (
            <div
              key={review._id || `${index}-${review.comment}`}
              className="border p-2 mb-2"
            >
              <strong>{review.rating}⭐</strong> - {review.comment}
              {user &&
                (user._id === (review.user._id || review.user) ||
                  user.role === "admin") && (
                  <button
                    onClick={() => deleteReview(review._id)}
                    className="btn btn-danger btn-sm ms-2"
                  >
                    Delete
                  </button>
                )}
            </div>
          ))}
          {hasMore && (
            <button
              className="btn btn-secondary mt-3"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Load More
            </button>
          )}
        </div>
      </div>
    )
  );
}

export default BookDetail;
