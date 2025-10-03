import {apiRequest} from "./modules/apiRequest.js";

const snackObject = JSON.parse(localStorage.getItem("snackObject"));
document.addEventListener("DOMContentLoaded", () => {
    if (snackObject !== null) {
        const data = {
            id: document.getElementById('id'),
            name: document.getElementById('name'),
            size: document.getElementById('size'),
            price: document.getElementById('price'),
            description: document.getElementById('description'),
            snackImg: document.getElementById('snackImg')
        };
        data.id.value = snackObject.id;
        data.name.value = snackObject.name;
        data.size.value = snackObject.size;
        data.price.value = snackObject.price;
        data.description.value = snackObject.description;
        data.snackImg.value = snackObject.snackImg;
    }
});

const STATUS_OK = 200;
const STATUS_CREATED = 201;


document.getElementById("btn").addEventListener("click", async (event) => {
    event.preventDefault();
    if (event.target.type !== "submit") return;

    try {
        const form = document.getElementById("snackForm");
        const plainText = new FormData(form);
        const plainObject = Object.fromEntries(plainText);
        const apiPepare = {url: "", method: ""};

        if (snackObject !== null) {
            apiPepare.url = `snacks/${snackObject.id}`;
            apiPepare.method = "PUT";

        } else {
            apiPepare.url = "snacks";
            apiPepare.method = "POST";
        }
        const response = await apiRequest(apiPepare.url, apiPepare.method, plainObject);

        if (response.status === STATUS_CREATED) {
            alert(`Snack gemt succesfuldt! ${response.data.name}`);
        }
        if (response.status === STATUS_OK) {
            localStorage.removeItem("snackObject");
            alert(`Snack blev opdateret! ${response.data.name}`);
        }


        window.location.href = "get-snacks.html";
    } catch (error) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = error.message;
    }
});