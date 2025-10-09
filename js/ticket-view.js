//import { apiRequest } from "./modules/apiRequest.js";

const ticketTable = document.getElementById("ticket-table")
const showingSelect = document.getElementById("showing-select")

async function getAllTicketData(){
    let data = await apiRequest("tickets", "GET", null)
    console.log(data)
    return data;
}

async function getTicketDataForShowing(showingID){
    let data = await apiRequest("tickets/of-showing?showing=" + showingID, "GET", null)
    console.log("heres the ticket data")
    console.log(data)
    return data;
}


async function getShowingData(){
    let data = await apiRequest("showings", "GET", null)
    console.log("heres the showing data:")
    console.log(data)
    return data
}

function fillTable(data){
    ticketTable.innerHTML = ""
    for(let ticket of data){
            const currentRow = document.createElement("tr");
            let cell = document.createElement("td")
            //adding ticket information
            cell.innerText = ticket.id
            currentRow.appendChild(cell)
            cell = document.createElement("td")
            cell.innerText = ticket.showing.date
            currentRow.appendChild(cell)
            cell = document.createElement("td")
            cell.innerText = ticket.showing.startTime
            currentRow.appendChild(cell)
            cell = document.createElement("td")
            cell.innerText = ticket.showing.endTime
            currentRow.appendChild(cell)
            cell = document.createElement("td")
            cell.innerText = ticket.showing.movie.title
            currentRow.appendChild(cell)
            cell = document.createElement("td")
            cell.innerText = ticket.customerEmail
            currentRow.appendChild(cell)
            cell = document.createElement("td")
            cell.innerText = ticket.customerName
            currentRow.appendChild(cell)
            cell = document.createElement("td")
            cell.innerText = ticket.seat
            currentRow.appendChild(cell)
            //adding an edit button
            cell = document.createElement("td")
            const editButton = document.createElement("button")
            editButton.innerText = "Redigere"
            editButton.value = ticket.id
            editButton.classList.add("edit-button")
            editButton.addEventListener("click", () => editTicket(editButton.value))
            cell.appendChild(editButton)
            currentRow.appendChild(cell)
            //adding a delete button
            cell = document.createElement("td")
            const deleteButton = document.createElement("button")
            deleteButton.innerText = "Slet"
            deleteButton.value = ticket.id
            deleteButton.classList.add("edit-button")
            deleteButton.addEventListener("click", () => deleteTicket(deleteButton.value))
            cell.appendChild(deleteButton)
            currentRow.appendChild(cell)
            ticketTable.appendChild(currentRow)
    }

}

function fillShowingSelect(data){
    showingSelect.innerHTML = ""
    const viewAll = document.createElement("option")
    viewAll.text = "View All"
    viewAll.value = "View All"
    showingSelect.appendChild(viewAll)
    for(let showing of data){
        const currentOption = document.createElement("option")
        currentOption.value = showing.id
        currentOption.text = showing.date + "  " + showing.startTime + " " + showing.movie.title
        showingSelect.appendChild(currentOption)
    }
}

async function changeTicketTable(){
    if (showingSelect.value === "View All"){
        const ticketData = await getAllTicketData()
        fillTable(ticketData.data)
    }else{
        const ticketData = await getTicketDataForShowing(showingSelect.value)
        fillTable(ticketData.data)
    }
}

function editTicket(id){

}

async function deleteTicket(id){
    const deleted = await apiRequest("tickets/" + id, "DELETE", null)
    if (deleted){
        await changeTicketTable()
    }else{
        console.log("ticket for deletion not found in database")
    }
}

async function init(){
    const ticketData = await getAllTicketData()
    fillTable(ticketData.data)
    const showingData = await getShowingData()
    fillShowingSelect(showingData.data)

}

init()

showingSelect.addEventListener("change", changeTicketTable)


const STATUS_NO_CONTENT = 204;

// Method has default value GET
// Data has default value null. If set it's the data from a form
/* Url is the endpoint we want to call but only the RequestMapping is added
From the RestController we need to contact */
export async function apiRequest(url, method = "GET", data = null) {
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
        return {status: response.status, data: await response.text()};
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

export function readyFormData(form){
    const plainText = new FormData(form);
    const plainObject = Object.fromEntries(plainText);
    return Object.fromEntries(Object.entries(plainObject)
        .map(([key, value]) => [
            key,
            value === "" ? null : value,
        ]));
}

