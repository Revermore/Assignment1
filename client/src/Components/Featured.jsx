import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

const Featured = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/books/featured");
        console.log(res);
        setFeaturedBooks(res.data.slice(0, 7));
      } catch (err) {
        console.error("Error fetching featured books:", err);
      }
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <Container className="my-4" style={{ maxWidth: "500px" }}>
      <h2 className="mb-2 text-center">Featured Books</h2>

      <div
        id="carouselExampleInterval"
        className="carousel slide px-2"
        data-bs-ride="carousel"
        style={{ maxWidth: "500px" }}
      >
        <div className="carousel-inner px-lg-5" style={{ maxWidth: "500px" }}>
          {featuredBooks.map((book, idx) => (
            <div
              className={`carousel-item px-2 ${idx === 0 ? "active" : ""}`}
              data-bs-interval="3000"
              key={book._id}
            >
              <Row
                className="justify-content-center"
                style={{ maxWidth: "500px" }}
              >
                <Col xs={12} md={12} lg={12}>
                  <Card className="h-100 border-0">
                    <div className="ratio ratio-1x1">
                      <Card.Img
                        variant="top"
                        src={book.coverImage}
                        className="img-fluid p-3"
                        style={{
                          objectFit: "contain",
                          height: "100%",
                          width: "100%",
                        }}
                        alt={book.name}
                      />
                    </div>
                    <Card.Body className="d-flex flex-column px-3 pb-3">
                      <Card.Title className="fs-5 text-center flex-grow-1">
                        {book.name} <br />
                        <span className="text-muted">by {book.author}</span>
                      </Card.Title>
                      <Card.Text className="text-center mb-0">
                        ⭐{" "}
                        {book.averageRating
                          ? book.averageRating.toFixed(1)
                          : "No rating yet"}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleInterval"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            style={{
              backgroundColor: "black",
            }}
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleInterval"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
            style={{
              backgroundColor: "black",
            }}
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </Container>
  );
};

export default Featured;
