import React, { useState, useRef, useEffect } from "react";
import "./styles/Login.css";
import { getAllBooks, addBook } from "./IndexedDB";

interface LoginProps {
  theme: string;
  toggleTheme: () => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setBooks: (books: any[]) => void;
  setSelectedBook: (book: any) => void;
  setBookContent: (content: string) => void;
  setCurrentPage: (page: number) => void;
  fetchBooks: () => void;
  books: any[];
  handleBookSelect: (book: any, email: string) => void;
}

/**
 * A bejelentkezest megvalosito fuggveny.
 * @param theme Az aktualis tema, a megjeleniteshez.
 * @param toggleTheme A tema valtoztatast kezelo fuggveny.
 * @param setIsLoggedIn A bejelentkezest tartolo boolean  allapotat beallito fuggveny.
 * @param setBooks A konyvek listajat beallioto fuggveny.
 * @param setSelectedBook A kivalasztott konyvet beallito fuggveny.
 * @param setBookContent A kivalasztott konyv tartalmat beallito fuggveny.
 * @param setCurrentPage Az aktualis oldalt beallito fuggveny.
 * @param fetchBooks Az osszes konyvet lekerdezo es feldolgozo fuggveny.
 * @param books Az osszes konyv listaja.
 * @param handleBookSelect A konyvek kivalasztasat kezelo fuggveny.
 * @returns a bejelentkezesi komponens html kodja.
 */
export function Login({
  theme,
  toggleTheme,
  setIsLoggedIn,
  setBooks,
  setSelectedBook,
  setBookContent,
  setCurrentPage,
  fetchBooks,
  books,
  handleBookSelect,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [register, setRegister] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null); //igy lehet egybol dom vagy react komponensre hivatkozni


  /**
   * A ref-el megadott input mezore fokuszal.
   */
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  /**
   * A bejelentkezesi formot kezelo fuggveny, ellenorzi a megadott adatok formatumanak helyesseget.
   * @param e Az esemeny ami a form bekuldese.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (register) {
      if (password !== confirmPassword) {
        alert("The given passwords do not match");
        return;
      }
      handleRegister(email, password);
    } else {
      handleLogin(email, password);
    }
  };

  /**
   * A bejelentkezest megvalosito fuggveny, ha sikeres a bejeletkezes, akkor a konyveket is lekeri.
   * @param email A felhasznalo email cime.
   * @param password A felhasznalo jelszava.
   * @returns belepteti a felhasznalot, ha a megadott adatok helyesek.
   */
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
        alert("Invalid login credentials ");
      }
    } else {
      alert("User not found with the given cerdentials");
    }
  };

  /**
   * A loginhoz hasonlo csak regisztraciora.
   * @param email A felhasznalo email cime.
   * @param password A felhasznalo jelszava.
   */
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
      alert("Please provide valid details");
    }
  };

  return (
    <div className="login-wrapper">
      <div className={`Login ${theme}`}>
        <h1>{register ? "Register" : "Login"}</h1>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {register && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <button type="submit">{register ? "Register" : "Login"}</button>
        </form>
        <button
          onClick={() => setRegister(!register)}
          className="toggle-button"
        >
          {register ? "Switch to Login" : "Switch to Register"}
        </button>
      </div>
    </div>
  );
}

export default Login;
