import {BrowserRouter, Route, Routes} from "react-router";

import Home from './pages/Home.jsx';
import Movies from "./pages/Movies.jsx";
import Navbar from "./components/Navbar.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import Person from "./pages/Person.jsx";
import AuthPage from "./pages/AuthPage.jsx";

function App() {



    return (
        <div>
            <BrowserRouter>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/movies" element={<Movies/>}/>
                    <Route path="/movies/:id" element={<MovieDetails/>}/>
                    <Route path="/people/:id" element={<Person/>}/>
                    <Route path="/login" element={<AuthPage/>}/>
                    <Route path="/register" element={<AuthPage/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App
