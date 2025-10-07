const URL = "http://localhost:8080/movies/future"

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

        const list = document.getElementById("movie-list")
        list.innerHTML = ""

        for (const movie of data) {
            const li = document.createElement("li");
            li.innerHTML = `
        <img src="${movie.movieImg}" alt="${movie.title}" />
        <h3>${movie.title}</h3>
        <h8 style="color:black">Aldersgrænse: ${movie.ageLimit} </h8>
        <h8 style="color:black">Længde: ${movie.movieLength} min </h8>
        <h8 style="color:black">Genre: ${movie.genres}</h8>
    `;
            li.addEventListener("click", () => {
                if(localStorage.getItem("movieId") !== null) localStorage.removeItem("movieId");
                localStorage.setItem("movieId", movie.id);
                //window.location.href = "get-showings.html";
            })
            list.appendChild(li);
        }

        console.log("Movies fetched:", data);

    } catch (error) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = error.message;
        console.error("Error fetching movies:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadMovies);