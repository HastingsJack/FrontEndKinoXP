const URL = "http://localhost:8080/snacks"
const order = new Map();

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


        snacks.forEach(snack => {
            let row = tbody.insertRow();
            let cell = row.insertCell();
            const imgTag = document.createElement("img");
            imgTag.src = snack.snackImg;
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

document.addEventListener("DOMContentLoaded", loadSnacks)