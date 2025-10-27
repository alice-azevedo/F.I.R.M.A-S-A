// assets/js/api.js

const API_URL = "http://localhost:3000"; //link temp.

export async function apiRequest(endpoint, method = "GET", data = null, token = null) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const options = {
        method,
        headers,
    };

    if (data) options.body = JSON.stringify(data);

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
    } catch (error){
        console.error("Erro na requisição:", error);
        return null;
    }
}