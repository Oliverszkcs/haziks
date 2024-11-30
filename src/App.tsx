import { useState } from 'react';
import './App.css';
import Login from './Login';
import BookReader from './BookReader';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState('light');
  const [bookContent] = useState("Page 1 content\n\nPage 2 content\n\nPage 3 content");

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleLogin = (email: string, password: string) => {
    if (email === "user@example.com" && password === "password") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid login credentials");
    }
  };

  const handleRegister = (email: string, password: string) => {
    if (email && password) {
      setIsLoggedIn(true);
    } else {
      alert("Please provide valid registration details");
    }
  };

  return (
    <div className={`App ${theme}`}>
      {isLoggedIn ? (
        <BookReader bookContent={bookContent} />
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
