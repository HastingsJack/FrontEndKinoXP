const URL = "http://localhost:8080"
const movieImages = document.querySelector("#featured-movie-image")
let data = "";
let index = 0;
let moviesArray = []


async function loadImages() {
    console.log("Fetching images...")
    const response = await fetch(`${URL}/movies/active`, {
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json"
        })
    })
    if (!response.ok) {
        throw new Error("Could not fetch movies.");
    }

    data = await response.json()


    movieImages.src = data[0].movieImg

}


const nextButton = document.querySelector("#next-in-array-button")
const prevButton = document.querySelector("#last-in-array-button")

function nextInArray() {
    if (index < data.length) {
        movieImages.src = data[index++].movieImg
        movieImages.href = data[index++].id
    } else if (index === data.length) {
        index = 0
        movieImages.src = data[index].movieImg

    }
}

function lastInArray() {
    if (index === 0) {
        index = data.length - 1;
    } else {
        index = index - 1;
    }
    movieImages.src = data[index].movieImg
}


document.addEventListener("DOMContentLoaded", () => {
    loadImages()
})

nextButton.addEventListener("click", nextInArray);
prevButton.addEventListener("click", lastInArray);

movieImages.addEventListener("click", () => {
        if (localStorage.getItem("movieId") !== null) localStorage.removeItem("movieId");
        localStorage.setItem("movieId", data[index].id);
        window.location.href = "get-showings.html";

});