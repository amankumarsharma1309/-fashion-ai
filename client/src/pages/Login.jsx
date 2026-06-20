import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Signup.css";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    async function handleLogin() {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/login`,
                {
                    email,
                    password,
                }
            );
            setMessage(response.data.message);
            if (response.data.message === "Login successful") {
                localStorage.setItem("token", response.data.token);
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }


            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-left">
                <Link
                    to="/"
                    className="logo-link"
                >
                    <h1>FashionAI</h1>
                </Link>

                <h2>Discover Your Perfect Style</h2>

                <p>
                    AI-powered fashion recommendations
                    tailored to your personality.
                </p>
            </div>

            <div className="signup-right">
                <form
                    className="signup-card"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                >
                    <h2>Login</h2>
                    <p className="signup-subtitle">
                        Welcome back to FashionAI
                    </p>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setMessage("");
                        }}
                    />

                    <div className="password-container">
                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setMessage("");
                            }
                            }

                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword ? (
                                <FaEyeSlash />
                            ) : (
                                <FaEye />
                            )}
                        </button>
                    </div>

                    <button type="submit">
                        Login
                    </button>
                    <p className={message.includes("successful") ? "success-message" : "error-message"}>
                        {message}
                    </p>

                    <p className="login-text">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="login-link"
                        >
                            Signup
                        </Link>
                    </p>
                </form>
            </div>
        </div >
    );
}

export default Login;