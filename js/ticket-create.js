const showingDropdown = document.getElementById("showing-select")
const email = document.getElementById("customer-email")
const customerName = document.getElementById("customer-name")
const seat = document.getElementById("seat-coords")
const seatGrid = document.getElementById("seat-grid")
const submitButton = document.getElementById("order-button")
const seatButtons = []
let selectedSeat = "A1"

async function getData(){
    const {status, data} = await apiRequest("showings/upcoming?date=2025-09-20");
    console.log(status);
    console.log(data)
    return data
}

function onShowingChange(){
    //changing the seats
    console.log("hello from on showing change")
    seatGrid.innerHTML = ""
    seatButtons.length = 0
    const selectedOption = showingDropdown.options[showingDropdown.selectedIndex];
    console.log("Raw dataset.wholeShowing:", selectedOption.dataset.wholeShowing);
    const showingData = JSON.parse(selectedOption.dataset.wholeShowing);
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

function getSeatArrayCoords(coord){
    let seatrow = coord.charCodeAt(0) - 65
    let seatColumn = parseInt(coord.slice(1), 10) -1

    return [seatrow, seatColumn];
}

async function orderTicket(){

    const dto = {
        id: null,
        customerEmail: email.value,
        customerName: customerName.value,
        seat: seat.value,
        showing: {
            id: showingDropdown.value

        }
    };

    console.log("DTO being sent:", dto);

    try {
        const response = await apiRequest("tickets", "POST", dto);
        console.log("Ticket registered:", response);
        alert("Ticket successfully registered!");
    } catch (err) {
        console.error("Error registering ticket:", err);
        alert("Failed to register ticket.");
    }

}


function fillDropdown(showings){
    showings.forEach(showing =>{
        const option = document.createElement("option")
        option.textContent = "Date:" + showing.date + " Time: " + showing.startTime + " Movie: " + showing.movie.title
        option.value = showing.id
        option.dataset.wholeShowing = JSON.stringify(showing)
        showingDropdown.appendChild(option)
    })
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





async function init(){
    let data = await getData()
    fillDropdown(data)
    onShowingChange()
}

init()

submitButton.addEventListener("click", (event) => {
    event.preventDefault()
    orderTicket()
})
showingDropdown.addEventListener("change", onShowingChange)

const STATUS_NO_CONTENT = 204;


// Method has default value GET
// Data has default value null. If set it's the data from a form
/* Url is the endpoint we want to call but only the RequestMapping is added
From the RestController we need to contact */
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





