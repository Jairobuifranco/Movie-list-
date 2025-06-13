import {useState} from "react";
import {useNavigate, useLocation} from "react-router";
import {loginUser, registerUser} from "../services/api.js";
import "../css/AuthPage.css"

function AuthPage() {
    const [form, setForm] = useState({email: "", password: ""});
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const preForm = location.state?.from || "/movies";
    const [status, setStatus] = useState("")

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.email || !form.password) {
            setError("Email and password are required.");
            return;
        }

        try {
            const loginRes = await loginUser(form);
            localStorage.setItem("token", loginRes.bearerToken.token);
            localStorage.setItem("refreshToken", loginRes.refreshToken.token);
            localStorage.setItem("tokenExpiry", Date.now() + loginRes.bearerToken.expires_in * 1000);
            setStatus("Logged in successfully.");
            navigate(preForm);
        } catch (loginErr) {
            if (loginErr.response?.status === 401) {
                setError("Login failed: Invalid credentials.");
            } else {
                setError("Login failed: Server error.");
            }

            try {
                const registerRes = await registerUser(form);
                localStorage.setItem("token", registerRes.bearerToken.token);
                localStorage.setItem("refreshToken", registerRes.refreshToken.token);
                setStatus("Registered successfully. Welcome!");
                navigate(preForm);
            } catch (registerErr) {
                if (registerErr.response?.status === 409) {
                    setError("Registration failed: User already exists.");
                } else {
                    setError("Registration failed: Server error.");
                }
            }
        }
    }

        return (
            <div className="person-page">
                <div className="auth-form-container">
                    <h2 className="text-center mb-4">Login or Register</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="form-control"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="form-control"
                        />
                        <button type="submit">Continue</button>
                    </form>
                    {error && <p className="auth-error">{error}</p>}
                </div>
            </div>
        );
    }

export default AuthPage;
