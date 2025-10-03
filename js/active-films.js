const URL = "http://localhost:8080/movies/active"

async function loadMovies() {
    console.log("Fetching movies...")
    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json();


        const movies = Array.isArray(data) ? data : Array.from(data || [])

        const list = document.getElementById("movie-list")
        list.innerHTML = ""

        for (const movie of movies) {
            const li = document.createElement("li");
            li.innerHTML = `
        <a href="/index.html">
        <img src="${movie.movieImg}" alt="${movie.title}" />
        <h3>${movie.title}</h3>
    `;
            list.appendChild(li);
        }

        console.log("Movies fetched:", movies);

    } catch (error) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = error.message;
        console.error("Error fetching movies:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadMovies);



