import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookList() {
  const { state } = useLocation();
  const books = state?.books || [];
  const navigate = useNavigate();

  if (!books || books.length === 0) {
    return <p className="text-center mt-4">Sorry! No such books were found.</p>;
  }

  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4 mt-3">
      {books.map((book) => (
        <Col key={book._id} onClick={() => navigate(`/books/${book._id}`)}>
          <Card className="h-100 shadow-sm Card">
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
  );
}
