import { useState } from 'react';
import './App.css';
import Login from './Login';
import BookReader from './BookReader';
import { useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState('light');
  const [bookContent] = useState("Page 1 content\n\nPage 2 content\n\nPage 3 content");

  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogin = (email: string, password: string) => {
    if (email === "asd@asd" && password === "password") {
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
      <button onClick={toggleTheme} style={{ position: 'absolute', top: 10, right: 10 }}>
        Toggle Theme
      </button>
      {isLoggedIn ? (
        <BookReader bookContent={bookContent} theme={theme} />
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
