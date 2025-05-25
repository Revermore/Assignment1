import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row className="text-center text-md-start">
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Book Haven™</h5>
            <p>© {new Date().getFullYear()} Book Haven. All rights reserved.</p>
          </Col>

          <Col md={4} className="mb-3 mb-md-0">
            <h6>Links</h6>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-decoration-none text-light">
                  Home
                </a>
              </li>
              <li>
                <a href="/books" className="text-decoration-none text-light">
                  Browse Books
                </a>
              </li>
              <li>
                <a href="/profile" className="text-decoration-none text-light">
                  Your Profile
                </a>
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h6>Contact Us</h6>
            <p>Email: support@bookhaven.com</p>
            <p>Twitter: @bookhaven</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
