import {useState} from "react";
import {registerUser} from "../services/api.js";
import {useNavigate} from "react-router";

function Register() {
    const [form, setForm] = useState({email: "", password: ""});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(form);
            setSuccess("Registration successful!");
            setError("");
            navigate("/movies");
        } catch {
            setError("Registration failed.");
            setSuccess("");
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}/>
                <input type="password" name="password" placeholder="Password" value={form.password}
                       onChange={handleChange}/>
                <button type="submit">Register</button>
            </form>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </div>
    );
}

export default Register;
