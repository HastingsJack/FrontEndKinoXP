import { apiRequest } from "./modules/apiRequest.js";

// Map to date and time
const dateMap = new Map();
const showings = [];
let selectedShowing = null;

const dateSelection = document.getElementById("date");

//stuff for seat selection:
const email = document.getElementById("customer-email")
const customerName = document.getElementById("customer-name")
const seat = document.getElementById("seat-coords")
const seatGrid = document.getElementById("seat-grid")
const submitButton = document.getElementById("order-button")
const seatButtons = []
let selectedSeat = "A1"
const showingsForDate = []
const timeSelection = document.getElementById("time")


document.addEventListener("DOMContentLoaded", async () => {
    const movieId = localStorage.getItem("movieId");
    //Hardcoding for testing
    //const movieId = 617126;

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
    const date = dateSelection.options[dateSelection.selectedIndex].label;
    showingsForDate.length = 0
    dateMap.forEach((timesArray, showingDate) => {
        if (date === showingDate) {
            timesArray.forEach(time => {
                timeSelection.innerHTML += `<option value="${time}">${time.slice(0, 5)}</option>`;
            })

        }
        for (const showing of showings){
            if ( showingDate === new Date(showing.date).toLocaleDateString("da-DK")){
                showingsForDate.push(showing)
            }
        }
    });
});

timeSelection.addEventListener("change", ()=>{
    if(showingsForDate.length === 0){
        return
    }
    for (const showing of showingsForDate){
        if(showing.startTime.toString() === timeSelection.value){
            switchSeats(showing)
            selectedShowing = showing
        }
    }
})

function switchSeats(showing){
    seatGrid.innerHTML = ""
    seatButtons.length = 0
    console.log(showing);
    const showingData = showing;
    //creating the seats:
    let columns = showingData.screen.seatColumns
    let rows = showingData.screen.seatRows
    for(let i = 0; i <rows ; i++){
        let rowArray = []
        const row = document.createElement("tr")
        const rowletter = String.fromCharCode(65 + i)
        for(let j = 0; j< columns; j++){
            const cell = document.createElement("td")
            const button = document.createElement("button")
            button.type = "button"
            button.classList.add("seat-button")
            button.classList.add("seat-available")
            button.value = rowletter + (j+1)
            button.textContent = rowletter + (j+1)
            button.addEventListener("click",() => selectSeat(button.value))
            cell.appendChild(button)
            row.appendChild(cell)
            rowArray.push(button)

        }
        seatGrid.appendChild(row)
        seatButtons.push(rowArray)
    }

    //making the seats taken:
    for(let ticket of showingData.tickets){
        let seatRow
        let seatColumn
        [seatRow, seatColumn] = getSeatArrayCoords(ticket.seat)
        const button = seatButtons[seatRow][seatColumn]
        if (button) {
            button.value = "Taken";
            button.textContent = "Taken";
            button.classList.remove("seat-available");
            button.classList.add("seat-taken");
        } else {
            console.warn("Button not found at", seatRow, seatColumn);
        }
    }
}

function selectSeat(value){
    if (value != "Taken"){

        //Deselecting the previous seat
        let seatRow;
        let seatColumn
        [seatRow, seatColumn] = getSeatArrayCoords(selectedSeat)
        let button = seatButtons[seatRow]?.[seatColumn];
        if (!button) {
            console.warn("Button not found at", seatRow, seatColumn, "value:", value);
            return;
        }
        if (!button.classList.contains("seat-taken")){

            button.classList.remove("seat-selected")
            button.classList.add("seat-available")
        }

        //Selecting the next seat:

        let result = getSeatArrayCoords(value)
        seatRow = result[0]
        seatColumn = result[1]
        button = seatButtons[seatRow]?.[seatColumn];
        if (!button) {
            console.warn("Button not found at", seatRow, seatColumn, "value:", value);
            return;
        }
        seatButtons[seatRow][seatColumn].classList.remove("seat-available")
        seatButtons[seatRow][seatColumn].classList.add("seat-selected")
        selectedSeat = value
        seat.value = value
    }
}

function getSeatArrayCoords(coord){
    let seatrow = coord.charCodeAt(0) - 65
    let seatColumn = parseInt(coord.slice(1), 10) -1

    return [seatrow, seatColumn];
}

function saveAndProceed(){
    if(selectedShowing === null ){
        return
    }

    localStorage.setItem("customerEmail", email.value);
    localStorage.setItem("customerName", customerName.value);
    localStorage.setItem("selectedSeat", seat.value)
    localStorage.setItem("selectedShowingID", selectedShowing.id)
    window.location.href = "create-snackorder.html";
}


submitButton.addEventListener("click", (event) => {
    event.preventDefault()
    saveAndProceed()
})

