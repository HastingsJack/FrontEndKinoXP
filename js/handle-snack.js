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
const STATUS_BADREQUEST = 400;

const btn = document.getElementById("btn");
btn.addEventListener("click", async (event) => {
    event.preventDefault();
    if (event.target.type !== "submit") return;

    try {
        const form = document.getElementById("snackForm");
        const plainText = new FormData(form);
        const plainObject = Object.fromEntries(plainText);
        const cleanedObject = Object.fromEntries(Object.entries(plainObject)
            .map(([key, value]) => [
                key,
                value === "" ? null : value,
            ]));
        const apiPepare = {url: "", method: ""};

        if (snackObject !== null) {
            apiPepare.url = `snacks/${snackObject.id}`;
            apiPepare.method = "PUT";

        } else {
            apiPepare.url = "snacks";
            apiPepare.method = "POST";
        }
        const response = await apiRequest(apiPepare.url, apiPepare.method, cleanedObject);

        if (response.status === STATUS_CREATED) {
            alert(`Snack gemt succesfuldt! ${response.data.name}`);
            window.location.href = "get-snacks.html";
        }
        if (response.status === STATUS_OK) {
            localStorage.removeItem("snackObject");
            alert(`Snack blev opdateret! ${response.data.name}`);
            window.location.href = "get-snacks.html";
        }

        if (response.status === STATUS_BADREQUEST) {
            const parsedData = JSON.parse(response.data);
            if (parsedData.name !== null)
                document.getElementById("missingName").textContent = parsedData.name;
            if (parsedData.size !== null)
                document.getElementById("missingSize").textContent = parsedData.size;
            if (parsedData.price !== null)
                document.getElementById("missingPrice").textContent = parsedData.price;
            if (parsedData.description !== null)
                document.getElementById("missingDescription").textContent = parsedData.description;
            if (parsedData.snackImg !== null)
                document.getElementById("missingImg").textContent = parsedData.snackImg;
        }



    } catch (error) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = error.message;
    }
});