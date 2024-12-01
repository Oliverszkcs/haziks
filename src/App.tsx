import { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import BookReader from './BookReader';
import BookList from './BookList';
import { Book } from './types/Book';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState('light');
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookContent, setBookContent] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);

  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/books.json');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const books = await response.json();
        setBooks(books);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const storedBooks = localStorage.getItem('books');
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
      }
    }
  }, [isLoggedIn]);

  const handleLogin = (email: string, password: string) => {
    const storedUser = localStorage.getItem(email);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.password === password) {
        setIsLoggedIn(true);
        localStorage.setItem('currentUserEmail', email);
        const userBooks = localStorage.getItem(`${email}_books`);
        if (userBooks) {
          setBooks(JSON.parse(userBooks));
        }
        const lastBookId = localStorage.getItem(`${email}_lastBookId`);
        if (lastBookId) {
          const lastBook = books.find(book => book.id === parseInt(lastBookId, 10));
          if (lastBook) {
            handleBookSelect(lastBook, email);
            const lastPage = localStorage.getItem(`${email}_${lastBookId}_currentPage`);
            if (lastPage) {
              setCurrentPage(parseInt(lastPage, 10));
            }
          }
        }
      } else {
        alert("Invalid login credentials");
      }
    } else {
      alert("User not found");
    }
  };

  const handleRegister = (email: string, password: string) => {
    if (email && password) {
      localStorage.setItem(email, JSON.stringify({ email, password }));
      setIsLoggedIn(true);
    } else {
      alert("Please provide valid registration details");
    }
  };

  const handleBookSelect = async (book: Book, email: string) => {
    setSelectedBook(book);
    const filePath = `/${book.filePath}`;
    console.log('Fetching book content from:', filePath);
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error('Failed to fetch book content');
        }
        const text = await response.text();
        setBookContent(text);
        setCurrentPage(0);
        const lastPage = localStorage.getItem(`${email}_${book.id}_currentPage`);
        if (lastPage) {
            setCurrentPage(parseInt(lastPage, 10));
        }
        localStorage.setItem(`${email}_lastBookId`, book.id.toString());
    } catch (error) {
        console.error(error);
    }
};

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (selectedBook) {
      const email = localStorage.getItem('currentUserEmail');
      if (email) {
        localStorage.setItem(`${email}_${selectedBook.id}_currentPage`, page.toString());
      }
    }
  };

  return (
    <div className={`App ${theme}`}>
        <button onClick={toggleTheme} style={{ position: 'absolute', top: 10, right: 10 }}>
            Toggle Theme
        </button>
        {isLoggedIn ? (
            <div className="main-content">
                <BookList books={books} onBookSelect={(book) => handleBookSelect(book, localStorage.getItem('currentUserEmail') || '')} title="Select a Book" />
                {selectedBook && (
                    <BookReader 
                        bookContent={bookContent} 
                        theme={theme} 
                        currentPage={currentPage} 
                        onPageChange={handlePageChange} 
                        availableBooks={books.map(book => book.title)}
                        onBookSelect={(bookTitle: string) => {
                            const book = books.find(b => b.title === bookTitle);
                            if (book) {
                                handleBookSelect(book, localStorage.getItem('currentUserEmail') || '');
                            }
                        }}
                    />
                )}
            </div>
        ) : (
            <Login 
                theme={theme} 
                toggleTheme={toggleTheme} 
                handleLogin={handleLogin}
                handleRegister={handleRegister} 
            />
        )}
    </div>
  );
}

export default App;
