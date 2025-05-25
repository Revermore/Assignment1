import React, { useState } from "react";
import {
  Button,
  Form,
  FormControl,
  Modal,
  Navbar,
  Offcanvas,
} from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../UserContext";

export default function Header({ onSearch }) {
  const { user, setUser, login } = useUser(); // get user and setter from context
  // New for login/signup modals
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10; // fixed limit, you can make this dynamic if you want
  const [addBookForm, setAddBookForm] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    coverImage: "",
    averageRating: "",
    ratingsCount: "",
  });
  const handleBookFormChange = (e) => {
    const { name, value } = e.target;
    setAddBookForm((prev) => ({
      ...prev,
      [name]:
        name === "averageRating" || name === "ratingsCount"
          ? Number(value)
          : value,
    }));
  };
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming you're storing it here
      const response = await fetch("http://localhost:5000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addBookForm),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add book");
      toast("Book added successfully!");
      setShowModal(false);
      setAddBookForm({
        title: "",
        author: "",
        description: "",
        genre: "",
        coverImage: "",
        averageRating: "",
        ratingsCount: "",
      });
    } catch (err) {
      alert("Error: " + err.message);
    }
  };
  const { logout } = useUser();
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  // Signup form state
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // optional if user doesn't select
  });

  // Toggle modals
  const toggleLogin = () => setShowLogin((s) => !s);
  const toggleSignup = () => setShowSignup((s) => !s);

  // Handlers for form input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await res.json();
      console.log("Login response:", data);
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Pass the complete user object including role to login function
      login(data.user, data.token); // Make sure your backend returns user with role
      toast.success("Logged in successfully!");
      toggleLogin();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  // Handle signup submit (dummy, replace with your auth logic)
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    // Optional: basic validation
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: signupData.username,
          email: signupData.email,
          password: signupData.password,
          role: signupData.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed, try again!");
      }

      toast.success("Signup successful!");
      setSignupData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [genre, setGenre] = useState("");

  const toggleOffcanvas = () => setShowOffcanvas((s) => !s);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setGenre(value);
  };
  const [totalPages, setTotalPages] = useState(1);
  const fetchBooks = async () => {
    try {
      // Create URLSearchParams object
      const params = new URLSearchParams();

      // Only add parameters that have values
      if (searchTerm) params.append("search", searchTerm);
      if (authorName) params.append("author", authorName);
      if (genre) params.append("genre", genre);
      params.append("page", page);
      params.append("limit", limit);

      const response = await fetch(
        `http://localhost:5000/books?${params.toString()}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch books");
      }

      console.log("Fetched books:", data.books);
      onSearch(data.books); // Pass only the books array to parent
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error(error.message);
      onSearch([]); // Clear results on error
      setTotalPages(1);
    }
  };

  const handleSearchBooks = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchBooks();
    if (showOffcanvas) setShowOffcanvas(false);
  };

  return (
    <div>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        sticky="top"
        className="w-100 px-3"
      >
        <Navbar.Brand href="/">Book Haven</Navbar.Brand>
        <Navbar.Toggle
          aria-controls="offcanvasNavbar"
          onClick={toggleOffcanvas}
          style={{ marginLeft: "auto" }}
        />
        <Navbar.Collapse className="d-none d-lg-flex justify-content-end">
          <Form className="d-flex" onSubmit={handleSearchBooks}>
            <FormControl
              type="search"
              placeholder="Search books"
              className="me-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Filters inline on desktop */}
            <FormControl
              type="search"
              placeholder="Author Name"
              className="me-2"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
            <Form.Select
              name="genre"
              value={genre}
              onChange={handleFilterChange}
              className="me-2"
              aria-label="Filter by genre"
            >
              <option value="">All Genres</option>
              <option value="Historical Fiction">Historical Fiction</option>
              <option value="Self-help">Self-help</option>
              <option value="Dark Romance">Dark Romance</option>
              <option value="Comedy">Comedy</option>
            </Form.Select>
            <Button type="submit" variant="outline-light">
              Search
            </Button>
            {user && user.role === "admin" && (
              <Button
                variant="warning"
                className="ms-3"
                onClick={() => setShowModal(true)}
              >
                Add Book
              </Button>
            )}
          </Form>
        </Navbar.Collapse>

        {/* Offcanvas for mobile */}
        <Offcanvas
          show={showOffcanvas}
          onHide={toggleOffcanvas}
          placement="start"
          className="bg-dark text-white"
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title>Search & Filters</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form onSubmit={handleSearchBooks}>
              <Form.Group className="mb-3" controlId="searchTermMobile">
                <Form.Label>Search Books</Form.Label>
                <Form.Control
                  type="search"
                  placeholder="Search books"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="searchTermMobile">
                <Form.Label>Search Author Name</Form.Label>
                <Form.Control
                  type="search"
                  placeholder="Author Name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Genre</Form.Label>
                <Form.Select
                  name="genre"
                  value={genre}
                  onChange={handleFilterChange}
                  aria-label="Filter by genre"
                >
                  <option value="">All Genres</option>
                  <option value="Historical Fiction">Historical Fiction</option>
                  <option value="Self-help">Self-help</option>
                  <option value="Dark Romance">Dark Romance</option>
                  <option value="Comedy">Comedy</option>
                </Form.Select>
              </Form.Group>
              <Button type="submit" variant="light" className="w-100">
                Search
              </Button>
              {user && user.role === "admin" && (
                <Button
                  variant="warning"
                  className="ms-3"
                  onClick={() => setShowModal(true)}
                >
                  Add Book
                </Button>
              )}
            </Form>
          </Offcanvas.Body>
        </Offcanvas>
        {user ? (
          <Button
            variant="outline-light"
            onClick={handleLogout}
            className="ms-3"
          >
            Log Out
          </Button>
        ) : (
          <Button
            variant="outline-light"
            onClick={toggleLogin}
            className="ms-3"
          >
            Log In
          </Button>
        )}
      </Navbar>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add a New Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {[
              "title",
              "author",
              "description",
              "genre",
              "coverImage",
              "averageRating",
              "ratingsCount",
            ].map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>{field}</Form.Label>
                <Form.Control
                  type={field.includes("Rating") ? "number" : "text"}
                  name={field}
                  value={addBookForm[field]}
                  onChange={handleBookFormChange}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            Add Book
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showLogin} onHide={toggleLogin} centered>
        <Modal.Header closeButton>
          <Modal.Title>Log In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Password"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Log In
            </Button>
          </Form>

          <div className="mt-3 text-center">
            Don't have an account?{" "}
            <Button
              variant="link"
              onClick={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
            >
              Sign Up
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Signup Modal */}
      <Modal show={showSignup} onHide={toggleSignup} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSignupSubmit}>
            <Form.Group className="mb-3" controlId="signupName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={signupData.username}
                onChange={handleSignupChange}
                placeholder="Enter your name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="signupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="signupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                placeholder="Password"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="signupConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                placeholder="Re-enter password"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="signupRole">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={signupData.role}
                onChange={handleSignupChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              Sign Up
            </Button>
          </Form>

          <div className="mt-3 text-center">
            Already have an account?{" "}
            <Button
              variant="link"
              onClick={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
            >
              Log In
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
