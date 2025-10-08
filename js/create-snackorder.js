

const URL = "http://localhost:8080/snacks"
const order = new Map();
const sendButton = document.getElementById("send-order")
let ticketData = null

async function loadSnacks() {
    console.log("Fetching snacks...")
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

        const snacksdata = await response.json();
        const snacks = sortSnacks(snacksdata)
        const table = document.getElementById("snackTable")
        const tbody = table.querySelector("tbody");
        console.log("Table:", table, "Tbody:", tbody);


        snacks.forEach(snack => {
            let row = tbody.insertRow();
            let cell = row.insertCell();
            const imgTag = document.createElement("img");
            imgTag.src = snack.snackImg
            imgTag.style.width = "50px";
            cell.appendChild(imgTag);

            row.insertCell().textContent = snack.name;
            row.insertCell().textContent = snack.size;
            row.insertCell().textContent = snack.price;
            row.insertCell().textContent = snack.description;

            let qtyCell = row.insertCell()
            qtyCell.textContent = snackTotal(snack, qtyCell)

            let actionCell = row.insertCell();
            const addBtn = document.createElement("button");
            addBtn.textContent = "Tilføj";
            addBtn.addEventListener("click", () => {
                addSnack(snack, qtyCell);
            });
            actionCell.appendChild(addBtn);

            let deleteCell = row.insertCell();
            const delBtn = document.createElement("button");
            delBtn.textContent = "Slet";
            delBtn.addEventListener("click", () => {
                removeSnack(snack, qtyCell);
            });
            deleteCell.appendChild(delBtn);

        });
        console.log("Snacks fetched:", snacks);
    } catch
        (error) {
        const errorMessage = document.getElementById("message");
        errorMessage.textContent = error.message;

        console.error("Error fetching snacks:", error);
    }
}

function addSnack(snack, qtyCell) {
    let currentQty = order.get(snack.id) || 0
    order.set(snack.id, currentQty + 1)
    qtyCell.textContent = order.get(snack.id)
    console.log("Order:", Object.fromEntries(order))
    saveOrder();
}

function removeSnack(snack, qtyCell) {
    let currentQty = order.get(snack.id)
    if(currentQty > 0) {
        order.set(snack.id, currentQty - 1)
        qtyCell.textContent = order.get(snack.id)
    }
    saveOrder();
    console.log("Order:", Object.fromEntries(order))
}

function snackTotal(snack) {
    return order.get(snack.id) || 0
}

function saveOrder() {
    const orderObj = Object.fromEntries(order); // convert Map → plain object
    localStorage.setItem("order", JSON.stringify(orderObj));
}

function sortSnacks(snacks) {
    return snacks.sort((a, b) => {

        const compareName = a.name.localeCompare(b.name);
        if (compareName !== 0) return compareName;

        return a.price - b.price;
    });
}

async function orderTicket(){
    if (localStorage.getItem("selectedShowingID") === null){
        console.log("fuck, its null")
        return
    }
    //this submits the ticket to the database:
    const dto = {
        id: null,
        customerEmail: localStorage.getItem("customerEmail"),
        customerName: localStorage.getItem("customerName"),
        seat: localStorage.getItem("selectedSeat"),
        showing: {
            id: localStorage.getItem("selectedShowingID")

        }
    };

    console.log("DTO being sent:", dto);

    try {
        const response = await apiRequest("tickets", "POST", dto);
        console.log("Ticket registered:", response);
        alert("Ticket successfully registered!");
        ticketData = response

    } catch (err) {
        console.error("Error registering ticket:", err);
        alert("Failed to register ticket.");
        ticketData = null
    }

}

async function orderSnacks(){
    //this submits the snacks to the database
    if (ticketData === null){
        console.log("its null")
        return
    }
    console.log((ticketData.data.id))
    let requests = 0
    let successes = 0
    for (const [snack_id, snack_quantity] of order){
        const dto = {
            id: null,
            quantity: snack_quantity,
            snack: {
                id : snack_id
            },
            ticket:{
                id: ticketData.data.id
            }

        };

        console.log("snack dto being sent:", dto)
        requests++
        try {
            const response = await apiRequest("snackorders", "POST", dto);
            console.log("Snack order registered:", response);
            successes++

        } catch (err) {
            console.error("Error registering ticket:", err);
            alert("Failed to register ticket.");
        }
    }

    if(requests == successes){
        alert("all snack orders were succesfull!")
    }
}



document.addEventListener("DOMContentLoaded", loadSnacks)
sendButton.addEventListener("click", onSendButton)
async function onSendButton(){
    await orderTicket()
    orderSnacks()
}
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