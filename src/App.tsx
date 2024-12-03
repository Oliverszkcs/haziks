import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";
import BookReader from "./BookReader";
import BookList from "./BookList";
import Menu from "./Menu";
import { getAllBooks, getBook, addBook, addNewBook } from "./IndexedDB";

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

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchBooks();
    }
  }, [isLoggedIn]);

  const handleLogin = (email: string, password: string) => {
    const storedUser = localStorage.getItem(email);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.password === password) {
        setIsLoggedIn(true);
        localStorage.setItem("currentUserEmail", email);
        fetchBooks();
        const lastBookId = localStorage.getItem(`${email}_lastBookId`);
        if (lastBookId) {
          const lastBook = books.find(
            (book) => book.id === parseInt(lastBookId, 10)
          );
          if (lastBook) {
            handleBookSelect(lastBook, email);
            const lastPage = localStorage.getItem(
              `${email}_${lastBookId}_currentPage`
            );
            if (lastPage) {
              setCurrentPage(parseInt(lastPage, 10));
            } else {
              localStorage.removeItem(`${email}_lastBookId`);
            }
          }
        }
      } else {
        alert("Invalid login credentials");
      }
    } else {
      alert("User not found with the given credentials");
    }
  };

  const handleRegister = async (email: string, password: string) => {
    if (email && password) {
      const books = await getAllBooks();
      setBooks(books);
      books.forEach((book: any) => addBook(book));
      localStorage.setItem(email, JSON.stringify({ email, password }));
      setIsLoggedIn(true);
      localStorage.setItem("currentUserEmail", email);
      if (books.length > 0) {
        handleBookSelect(books[0], email);
      }
    } else {
      alert("Please provide valid registration details");
    }
  };

  const handleBookSelect = async (book: any, email: string) => {
    setSelectedBook(book);
    const storedBook = await getBook(book.id);
    if (storedBook) {
      setBookContent(storedBook.content);
    } else {
      const response = await fetch(`/${book.content}`);
      const text = await response.text();
      setBookContent(text);
      addBook({ ...book, content: text });
    }
    setCurrentPage(0);
    const lastPage = localStorage.getItem(`${email}_${book.id}_currentPage`);
    if (lastPage) {
      setCurrentPage(parseInt(lastPage, 10));
    }
    localStorage.setItem(`${email}_lastBookId`, book.id.toString());
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (selectedBook) {
      const email = localStorage.getItem("currentUserEmail");
      if (email) {
        localStorage.setItem(
          `${email}_${selectedBook.id}_currentPage`,
          page.toString()
        );
      }
    }
  };

  const handleAddNewBook = async () => {
    const maxId = books.reduce(
      (max, book) => (book.id > max ? book.id : max),
      0
    );
    const newBook = {
      id: maxId + 1,
      title: newBookTitle,
      content: newBookContent,
    };
    await addNewBook(newBook);
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    setIsModalOpen(false);
    setNewBookTitle("");
    setNewBookContent("");
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
                localStorage.getItem("currentUserEmail") || ""
              )
            }
            title="Available Books"
          />
          {selectedBook ? (
            <BookReader
              bookContent={bookContent}
              theme={theme}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              availableBooks={books.map((book) => book.title)}
              onBookSelect={(bookTitle: string) => {
                const book = books.find((b) => b.title === bookTitle);
                if (book) {
                  handleBookSelect(
                    book,
                    localStorage.getItem("currentUserEmail") || ""
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
          handleLogin={handleLogin}
          handleRegister={handleRegister}
        />
      )}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Book</h2>
            <label>
              Title:
              <input
                type="text"
                value={newBookTitle}
                onChange={(e) => setNewBookTitle(e.target.value)}
              />
            </label>
            <label>
              Content:
              <input type="file" accept=".txt" onChange={handleFileUpload} />
            </label>
            <button onClick={handleAddNewBook}>Add Book</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
