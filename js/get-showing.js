import { apiRequest } from "./modules/apiRequest.js";

// Map to date and time
const dateMap = new Map();
const showings = [];

const dateSelection = document.getElementById("date");

document.addEventListener("DOMContentLoaded", async () => {
    const movieId = localStorage.getItem("movieId");

    const response = await apiRequest(`showings?movieId=${movieId}`);

    if (response.status !== 200) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = response.data;
        return;
    }

    // I need to use ...await response.data because if i just push await response.data
    // Showings has a object with and array inside. If i use ... we will receive all the entries
    // And add them as multiple objects.
    showings.push(...await response.data);

    try {
        const movieTitle = document.getElementById("movieTitle");
        const imgTag = document.getElementById("imgTag");

        // Adds movie title to the page
        movieTitle.textContent = showings[0].movie.title;
        // Adds image to the page
        imgTag.src = showings[0].movie.movieImg;
        imgTag.style.width = "200px";
        imgTag.style.height = "200px";
        imgTag.style.objectFit = "cover"; // beskærer billedet pænt i stedet for at strække det

        // Loops through the showings of a movie
        for (const showing of showings) {
            // Format date to danish
            const showingDate = new Date(showing.date).toLocaleDateString("da-DK")

            // Set key to date if it doesn't exist
            if (!dateMap.has(showingDate)) {
                dateMap.set(showingDate, []);
            }

            // Adds time to date.
            dateMap.get(showingDate).push(showing.startTime);
        }

        // Loops through the dates and times
        let optionValue = 1;
        dateMap.forEach((timesArray, showingDate) => {
            // Adds date to the dropdown
            dateSelection.innerHTML += `<option value="${optionValue++}">${showingDate}</option>`;
        });


    } catch (error) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = error.message;
    }
});


dateSelection.addEventListener("change", () => {
    const timeSelection = document.getElementById("time");
    const date = dateSelection.options[dateSelection.selectedIndex].label;

    dateMap.forEach((timesArray, showingDate) => {
        if (date === showingDate) {
            timesArray.forEach(time => {
                timeSelection.innerHTML += `<option value="${time}">${time.slice(0, 5)}</option>`;
            })
        }
    });
});
