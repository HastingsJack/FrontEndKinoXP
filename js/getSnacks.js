import { apiRequest } from "./modules/apiRequest.js";

const STATUS_OK = 200;
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

                cell.innerHTML = `<button type="submit" data-kode="${snack.id}">Opdater</button>`;
                cell = row.insertCell(cellCount++);

                cell.innerHTML = `<button type="submit" data-kode="${snack.id}">Slet</button>`;
            });
        }
    } catch (error) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = error.message;
    }
});

document.addEventListener("click", async (event) => {
    event.preventDefault();
    if(event.target.type !== BUTTON_TYPE_SUBMIT) return;
    const snackID = event.target.dataset.kode;

    if(localStorage.getItem("snackID") === snackID) localStorage.removeItem("snackID");
    if(localStorage.getItem("snackObject") !== null) localStorage.removeItem("snackObject");

    const snackObject = {
        id: null,
        name: event.target.parentElement.parentElement.cells[1].dataset.name,
        size: event.target.parentElement.parentElement.cells[2].dataset.size,
        price: event.target.parentElement.parentElement.cells[3].dataset.price,
        snackImg: event.target.parentElement.parentElement.cells[0].dataset.snackImg,
        description: event.target.parentElement.parentElement.cells[4].dataset.description
    }

    localStorage.setItem("snackObject", JSON.stringify(snackObject));
    localStorage.setItem("snackID", snackID);
    window.location.href = "edit-snack.html";
})
