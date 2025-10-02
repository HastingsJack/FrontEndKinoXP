import { apiRequest } from "./modules/apiRequest.js";

const STATUS_OK = 200;
//const STATUS_NO_CONTENT = 204;
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
                cell = row.insertCell(cellCount++);

                cell.textContent = snack.name;
                cell = row.insertCell(cellCount++);

                cell.textContent = snack.size;
                cell = row.insertCell(cellCount++);

                cell.textContent = snack.price;
                cell = row.insertCell(cellCount++);

                cell.textContent = snack.description;
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


