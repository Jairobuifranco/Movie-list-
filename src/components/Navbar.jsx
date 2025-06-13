import {Link, useNavigate} from "react-router";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    }


    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
            <Link to="/" className="navbar-brand">🎬 MovieVerse</Link>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <Link to="/movies" className="nav-link">Movies</Link>
                    </li>
                </ul>
                <ul className="navbar-nav">
                    {token ? (
                        <>
                            <li className="nav-item text-light nav-link">
                                Logged in
                            </li>
                            <li className="nav-item">
                                <button onClick={handleLogout} className="btn btn-outline-light">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li className="nav-item">
                            <Link to="/login" className="btn btn-outline-primary">Login / Register</Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;