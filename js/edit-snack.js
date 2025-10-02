import {apiRequest} from "./modules/apiRequest.js";
const STATUS_OK = 200;

document.addEventListener("DOMContentLoaded", () => {
    const snackObject = JSON.parse(localStorage.getItem("snackObject"));
    const data = {
        id: document.getElementById('id'),
        name: document.getElementById('name'),
        size: document.getElementById('size'),
        price: document.getElementById('price'),
        description: document.getElementById('description'),
        img: document.getElementById('img')
    };
    data.id.value = snackObject.id;
    data.name.value = snackObject.name;
    data.size.value = snackObject.size;
    data.price.value = snackObject.price;
    data.description.value = snackObject.description;
    data.img.value = snackObject.snackImg;
});

document.getElementById("btn").addEventListener("click", async (event) => {
    event.preventDefault();
    if (event.target.type !== "submit") return;

    try {
        const snackID = localStorage.getItem("snackID");
        const form = document.getElementById("snackForm");
        const urlUpdate = `snacks/${snackID}`;
        const plainText = new FormData(form);
        const plainObject = Object.fromEntries(plainText);

        const response = await apiRequest(urlUpdate, "PUT", plainObject);
        if (response.status === STATUS_OK){
            localStorage.removeItem("snackID");
            localStorage.removeItem("snackObject");

            alert(`Snack gemt succesfuldt! ${response.data.name}`);

            window.location.href = "get-snacks.html";
        }
    } catch (error) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = error.message;
    }
})