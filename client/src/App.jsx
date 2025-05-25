import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./Components/Footer.jsx";
import Header from "./Components/Header.jsx";
import BookDetails from "./pages/BookDetails.jsx";
import BookList from "./pages/BookList.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";

const App = () => {
  const [books, setBooks] = useState([]);
  const handleSearch = (booksData) => {
    setBooks(booksData);
    navigate("/books", { state: { books: booksData } });
  };
  console.log("Books: ", books);
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column min-vh-100 w-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <Header onSearch={handleSearch} className="w-100" />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
