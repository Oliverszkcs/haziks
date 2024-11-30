import React, { useState } from "react";
import "./Login.css";

interface LoginProps {
    theme: string;
    toggleTheme: () => void;
    handleLogin: (email: string, password: string) => void;
    handleRegister: (email: string, password: string) => void;
}
export function Login({ theme, toggleTheme, handleLogin, handleRegister }: LoginProps) {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [register, setRegister] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
            handleRegister(email, password);
        if (register) {
           handleLogin(email, password);
        } else {
           console.log("Logging in with", email, password);
        }
    };

    return (
        <div className="Login">
            <h1>{register ? "Register" : "Login"}</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit">{register ? "Register" : "Login"}</button>
            </form>
            <button onClick={() => setRegister(!register)} style={{ margin: '10px' }}>
                {register ? "Login" : "Register"}
            </button>
            <button onClick={toggleTheme} style={{ margin: '20px', padding: '10px', fontSize: '1em' }}>
                Switch to {theme === 'light' ? 'dark' : 'light'} theme
            </button>
        </div>
    );
}

export default Login;