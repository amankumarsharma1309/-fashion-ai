import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Signup.css";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



function getPasswordStrength(password) {
    if (password.length < 6 && password.length != 0) {
        return "Weak";
    }

    const hasUpper =
        /[A-Z]/.test(password);

    const hasNumber =
        /[0-9]/.test(password);

    const hasSpecial =
        /[^A-Za-z0-9]/.test(password);

    if (
        hasUpper &&
        hasNumber &&
        hasSpecial
    ) {
        return "Strong";
    }

    if (password.length == 0) return "";
    return "Medium";
}

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState("");
    async function handleSignup() {
        if (!name || !email || !password) {
            setMessage("All fields are required!");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:5000/send-otp",
                {
                    name,
                    email,
                    password,
                }
            );
            if (
                response.data.message ===
                "OTP sent successfully!"
            ) {
                setShowOtp(true);
            }
            setMessage(response.data.message);

        } catch (error) {
            console.log(error);
        }
    }

    async function handleVerifyOtp() {
        try {
            const response = await axios.post(
                "http://localhost:5000/verify-otp",
                {
                    email,
                    otp,
                }
            );

            setMessage(response.data.message);
            if (
                response.data.message ===
                "Signup successful"
            ) {
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }

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
                <div className="signup-card">
                    <h2>Create Account</h2>
                    <p className="signup-subtitle">
                        Join FashionAI today
                    </p>

                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        disabled={showOtp}
                        onChange={(e) => {
                            setName(e.target.value)
                            setMessage("");
                        }
                        }
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        disabled={showOtp}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setMessage("");
                        }
                        }
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
                            disabled={showOtp}
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


                    <p
                        className={`password-strength ${getPasswordStrength(password)
                            }`}
                    >
                        Password Strength:{" "}
                        {getPasswordStrength(password)}
                    </p>

                    {
                        showOtp && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => {
                                        setOtp(e.target.value)
                                        setMessage("")
                                    }

                                    }
                                />
                                <button onClick={handleVerifyOtp}>
                                    Verify OTP
                                </button>
                            </>

                        )
                    }

                    {
                        !showOtp && (
                            <button onClick={handleSignup}>
                                Create Account
                            </button>
                        )
                    }
                    {message && (
                        <p className="message">
                            {message}
                        </p>
                    )}

                    <p className="login-text">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="login-link"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;