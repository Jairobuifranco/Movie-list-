const BASE_URL = "http://4.237.58.241:3000";

// Movie fetch
export const fetchMovies = async (page=1, perPage=100) => {
    const response = await fetch(`${BASE_URL}/movies/search?page=${page}&limit=${perPage}`);
    const data = await response.json();
    return {data: data.data, totalCount: data.pagination.total};

};

// Movie details fetch
export const fetchMovieData = async (imdbID) => {
    const response = await fetch(`${BASE_URL}/movies/data/${imdbID}`);
    return await response.json();
};

// People details fetch
export const fetchPerson = async (id, token) => {
    const response = await fetch(`${BASE_URL}/people/${id}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    if (!response.ok) throw new Error("Unauthorized");
    return response.json();
};

// Registration
export const registerUser = async (formData) => {
    const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("Registration failed");
    return await response.json();
};

//Login
export const loginUser = async (formData) => {
    const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("Login failed");
    return await response.json();
};

// Refresh token
export const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    const response = await fetch(`${BASE_URL}/user/refresh`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({token: refreshToken})
    });

    if (!response.ok) throw new Error("Failed to refresh");

    const data = await response.json();
    localStorage.setItem("token", data.bearerToken.token);
    return data.bearerToken.token;
};

//Logout
export const logout = async (refreshToken) => {
    const response = await fetch(`${BASE_URL}/user/logout`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({token: refreshToken})
    })
    if (!response.ok) throw new Error("Logout failed");
    return await response.json();
}
