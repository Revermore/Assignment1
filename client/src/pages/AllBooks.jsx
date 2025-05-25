import React, { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const AllBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const fetchBooks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/books`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch books");
      }

      console.log("Fetched books:", data.books);
      setBooks(data.books); // Pass only the books array to parent
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error(error.message);
      setBooks([]); // Clear results on error
    }
  };
  const handleCardClick = () => {
    navigate(`/books/${book._id}`);
  };

  useEffect(fetchBooks(), []);

  return (
    <div>
      {
        <Row xs={1} sm={2} md={3} lg={4} className="g-4 mt-3">
          {books.map((book) => (
            <Col key={book._id || book.id}>
              <Card className="h-100 shadow-sm" onClick={handleCardClick}>
                {book.coverImage && (
                  <Card.Img
                    variant="top"
                    src={book.coverImage}
                    alt={book.title}
                  />
                )}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {book.author || "Unknown Author"}
                  </Card.Subtitle>
                  <Card.Text>
                    Genre: {book.genre || "N/A"} <br />
                    Rating:{" "}
                    {book.rating ? `${book.rating} ⭐` : "No ratings yet"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      }
    </div>
  );
};

export default AllBooks;
