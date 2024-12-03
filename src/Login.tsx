import React, { useState, useRef, useEffect } from "react";
import "./Login.css";

interface LoginProps {
  handleRegister: (email: string, password: string) => void;
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

export function Login({
  handleRegister,
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
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (register) {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      handleRegister(email, password);
    } else {
      handleLogin(email, password);
    }
  };

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
