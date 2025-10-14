const URL = "http://localhost:8080"
const movieImages = document.querySelector("#featured-movie-image")
let data ="";
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
    if(!response.ok) {
        throw new Error("Could not fetch movies.");
    }

    data = await response.json()


    for( const movie of data){
        moviesArray.push(movie.movieImg)
    }

    movieImages.src = moviesArray[index]

}


const nextButton = document.querySelector("#next-in-array-button")
const prevButton = document.querySelector("#last-in-array-button")

function nextInArray() {
    if(index < moviesArray.length){
    movieImages.src = moviesArray[index++]
    }else if(index === moviesArray.length){
        index = 0
        movieImages.src = moviesArray[index]
    }
}

function lastInArray() {
    if(index === 0){
    index = moviesArray.length - 1;
    }else{
    index = index - 1;
    }
    movieImages.src = moviesArray[index]
}



document.addEventListener("DOMContentLoaded", () => {
    loadImages()
})

nextButton.addEventListener("click", nextInArray);
prevButton.addEventListener("click", lastInArray);