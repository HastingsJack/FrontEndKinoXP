const showingDropdown = document.getElementById("showing-select")
const email = document.getElementById("customer-email")
const customerName = document.getElementById("customer-name")
const seat = document.getElementById("seat-coords")
const seatGrid = document.getElementById("seat-grid")
const submitButton = document.getElementById("order-button")
const seatButtons = []
let selectedSeat = "A1"

async function getDataTest(){
    const {status, data} = await apiRequest("showings/upcoming?date=2025-09-20");
    console.log(status);
    console.log(data)
    return data
}

function onShowingChange(){
    //changing the seats
    seatGrid.innerHTML = ""
    seatButtons.length = 0

    //creating the seats:
    let columns = 25 //showingDropdown.value.dataset.wholeShowing.screen.seatColumns
    let rows = 16//showingDropdown.value.dataset.wholeShowing.screen.seatRows
    for(let i = 0; i <rows ; i++){
        let rowArray = []
        const row = document.createElement("tr")
        const rowletter = String.fromCharCode(65 + i)
        for(let j = 0; j< columns; j++){
            const cell = document.createElement("td")
            const button = document.createElement("button")
            button.value = rowletter + (j+1)
            button.textContent = rowletter + (j+1)
            button.classList.add("seat-button")
            button.addEventListener("click",() => selectSeat(button.value))
            cell.appendChild(button)
            row.appendChild(cell)
            rowArray.push(button)

        }
        seatGrid.appendChild(row)
        seatButtons.push(rowArray)
    }

    //making the seats taken:
    for(let ticket of showingDropdown.dataset.wholeShowing.tickets){
        let seatRow = ticket.seat.charCodeAt(0) - 65
        let seatColumn = parseInt(ticket.seat.charAt(1), 10)
        seatButtons[seatRow][seatColumn].value = "Taken"
        seatButtons[seatRow][seatColumn].textContent = "Taken"
    }

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
        option.dataset.wholeShowing = showing
        showingDropdown.appendChild(option)
    })
}

function selectSeat(value){
    if (value != "Taken"){
        selectedSeat = value
    }
}


submitButton.addEventListener("click", (event) => {
    event.preventDefault()
    orderTicket()
})
showingDropdown.addEventListener("change", onShowingChange)


async function init(){
    let data = await getDataTest()
    fillDropdown(data)
}

init()


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





