import React, { useState, useRef, useEffect } from "react";
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

    return (
        <div className="login-wrapper">
            <div className={`Login ${theme}`}>
                <h1>{register ? "Register" : "Login"}</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                <button onClick={() => setRegister(!register)} className="toggle-button">
                    {register ? "Switch to Login" : "Switch to Register"}
                </button>
            </div>

        </div>
    );
}

export default Login;
