import React, { useState } from "react";
import "./Login.css";

interface LoginProps {
    handleLogin: (email: string, password: string) => void;
    handleRegister: (email: string, password: string) => void;
    theme: string;
    toggleTheme: () => void;
}

export function Login({ handleLogin, handleRegister, theme, toggleTheme }: LoginProps) {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [confirmPassword, setConfirmPassword] = useState("");
    let [register, setRegister] = useState(false);

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

    return (
        <div className="login-wrapper">
            <div className={`Login ${theme}`}>
                <h1>{register ? "Register" : "Login"}</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div>
                        <label>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    {register && (
                        <div>
                            <label>Confirm Password</label>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                        </div>
                    )}
                    <button type="submit">{register ? "Register" : "Login"}</button>
                </form>
                <button onClick={() => setRegister(!register)} className="toggle-button">
                    {register ? "Login" : "Register"}
                </button>
            </div>
        </div>
    );
}

export default Login;
