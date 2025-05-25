import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // if you're using toasts

const Home = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/books`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch books");
      }

      console.log("Fetched books:", data.books);
      setBooks(data.books); // set only the books
    } catch (error) {
      console.error("Error fetching books:", error);
      toast?.error?.(error.message || "Fetch failed");
      setBooks([]);
    }
  };

  useEffect(() => {
    fetchBooks(); // ✅ now it's a function inside a function
  }, []);

  return (
    <div>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4 my-3 mb-3">
        {books.map((book) => (
          <Col
            key={book._id}
            className="Card"
            onClick={() => navigate(`/books/${book._id}`)}
          >
            <Card className="h-100 shadow-sm">
              {book.coverImage && (
                <div
                  style={{
                    width: "100%",
                    height: "350px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8f8f8",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={book.coverImage}
                    alt={book.title}
                    style={{
                      height: "100%",
                      width: "auto",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {book.author || "Unknown Author"}
                </Card.Subtitle>
                <Card.Text>
                  Genre: {book.genre || "N/A"} <br />
                  Rating: {book.rating ? `${book.rating} ⭐` : "No ratings yet"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
