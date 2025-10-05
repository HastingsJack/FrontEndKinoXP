//import { apiRequest } from "./modules/apiRequest.js";

document.addEventListener("DOMContentLoaded", async () => {
    const movieId = 617126;

    const response = await apiRequest(`showings?movieId=${movieId}`);

    if (response.status !== 200) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = response.data;
        return;
    }

    const showings = response.data;

    try{
        const div = document.getElementById("showing")
        const imgTag = document.createElement("img");

        for (const showing of showings) {
            imgTag.src = showing.movie.movieImg;
            div.appendChild(imgTag);
        }

    }catch (error) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = error.message;
    }
});



const STATUS_NO_CONTENT = 204;
async function apiRequest(url, method = "GET", data = null) {
    const options = {method, headers: {}};
    // our base url is http://localhost:8080/
    const baseUrl = `http://localhost:8080/${url}`;

    // If data has data, we need to set header type to json and stringify data
    if (data) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
    }

    const response = await fetch(baseUrl, options);

    // Check if response is ok, if not, throw error
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Fejl ${response.status}: ${errorMessage}`);
    }

    // try to parse response as json, if not, return response as text
    try {
        // When we delete, api response has no body. We cant use response.json()
        if (response.status === STATUS_NO_CONTENT) return {status: response.status, data: null};

        // When we get a body, we can use response.json()
        const data = await response.json();
        return {status: response.status, data: data};
    } catch {
        return await response.text();
    }
}