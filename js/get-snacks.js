//import { apiRequest } from "./modules/apiRequest.js";


const STATUS_OK = 200;
const STATUS_NO_CONTENT = 204;
const BUTTON_TYPE_SUBMIT = "submit";
const URL = "snacks";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const table = document.getElementById("snackTable");
        const snacks = await apiRequest(URL);

        if (snacks.status === STATUS_OK) {
            snacks.data.forEach(snack => {
                let cellCount = 0;
                let tableRow = table.rows.length;
                let row = table.insertRow(tableRow);

                let cell = row.insertCell(cellCount++);

                const imgTag = document.createElement("img");
                imgTag.src = snack.snackImg;
                cell.appendChild(imgTag);
                cell.dataset.snackImg = snack.snackImg;
                cell = row.insertCell(cellCount++);

                cell.textContent = snack.name;
                cell.dataset.name = snack.name;
                cell = row.insertCell(cellCount++);

                cell.textContent = snack.size;
                cell.dataset.size = snack.size;
                cell = row.insertCell(cellCount++);

                cell.textContent = snack.price;
                cell.dataset.price = snack.price;
                cell = row.insertCell(cellCount++);

                cell.textContent = snack.description;
                cell.dataset.description = snack.description;
                cell = row.insertCell(cellCount++);

                cell.innerHTML = `<button type="submit" data-id="${snack.id}">Opdater</button>`;
                cell = row.insertCell(cellCount++);

                cell.innerHTML = `<button type="submit" data-delete="${snack.id}">Slet</button>`;
            });
        }
    } catch (error) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = error.message;
    }
});

document.addEventListener("click", async (event) => {
    event.preventDefault();
    if (event.target.type !== BUTTON_TYPE_SUBMIT) return;

    if (localStorage.getItem("snackObject") !== null) localStorage.removeItem("snackObject");

    if (event.target.dataset.delete !== undefined) {
        await apiRequest(
            `snacks/${event.target.dataset.delete}`,
            "DELETE");

        window.location.href = "get-snacks.html"
        return;
    }

    if (event.target.dataset.id !== undefined) {
        const snackObject = {
            id: event.target.dataset.id,
            name: event.target.parentElement.parentElement.cells[1].dataset.name,
            size: event.target.parentElement.parentElement.cells[2].dataset.size,
            price: event.target.parentElement.parentElement.cells[3].dataset.price,
            snackImg: event.target.parentElement.parentElement.cells[0].dataset.snackImg,
            description: event.target.parentElement.parentElement.cells[4].dataset.description
        }

        localStorage.setItem("snackObject", JSON.stringify(snackObject));
        window.location.href = "handle-snack.html";

    }
    if (event.target.dataset.create !== undefined) {
        window.location.href = "handle-snack.html";
    }
});

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
