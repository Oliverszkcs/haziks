import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";
import BookReader from "./BookReader";
import BookList from "./BookList";
import Menu from "./Menu";
import Modal from "./Modal";
import { getAllBooks, addBook, addNewBook } from "./IndexedDB";
import { handleBookSelect, handlePageChange, handleAddNewBook } from "./BookActions";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [bookContent, setBookContent] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newBookTitle, setNewBookTitle] = useState<string>("");
  const [newBookContent, setNewBookContent] = useState<string>("");

  const handleLogout = () => {
    setIsLoggedIn(false);
    setBooks([]);
    setSelectedBook(null);
    setBookContent("");
    setCurrentPage(0);
    localStorage.removeItem("currentUserEmail");
  };

  const toggleTheme = () =>
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const fetchBooks = async () => {
    const books = await getAllBooks();
    setBooks(books);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewBookContent(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`App ${theme}`}>
      {isLoggedIn ? (
        <div className="main-content">
          <BookList
            books={books}
            onBookSelect={(book) =>
              handleBookSelect(
                book,
                localStorage.getItem("currentUserEmail") || "",
                setSelectedBook,
                setBookContent,
                setCurrentPage
              )
            }
            title="Available Books"
          />
          {selectedBook ? (
            <BookReader
              bookContent={bookContent}
              theme={theme}
              currentPage={currentPage}
              onPageChange={(page) =>
                handlePageChange(page, selectedBook, setCurrentPage)
              }
              availableBooks={books.map((book) => book.title)}
              onBookSelect={(bookTitle: string) => {
                const book = books.find((b) => b.title === bookTitle);
                if (book) {
                  handleBookSelect(
                    book,
                    localStorage.getItem("currentUserEmail") || "",
                    setSelectedBook,
                    setBookContent,
                    setCurrentPage
                  );
                }
              }}
            />
          ) : (
            <div className="book-reader"></div>
          )}
          <div className="separator"></div>
          <Menu
            onThemeChange={toggleTheme}
            onLogout={handleLogout}
            onAddNewBook={() => setIsModalOpen(true)}
          />
        </div>
      ) : (
        <Login
          theme={theme}
          toggleTheme={toggleTheme}
          setIsLoggedIn={setIsLoggedIn}
          setBooks={setBooks}
          setSelectedBook={setSelectedBook}
          setBookContent={setBookContent}
          setCurrentPage={setCurrentPage}
          fetchBooks={fetchBooks}
          books={books}
          handleBookSelect={(book, email) =>
            handleBookSelect(
              book,
              email,
              setSelectedBook,
              setBookContent,
              setCurrentPage
            )
          }
        />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddNewBook={() =>
          handleAddNewBook(
            books,
            newBookTitle,
            newBookContent,
            setBooks,
            setIsModalOpen,
            setNewBookTitle,
            setNewBookContent
          )
        }
        newBookTitle={newBookTitle}
        setNewBookTitle={setNewBookTitle}
        handleFileUpload={handleFileUpload}
      />
    </div>
  );
}

export default App;
