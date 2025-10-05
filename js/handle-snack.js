//import { apiRequest } from "./modules/apiRequest.js";

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
const STATUS_NO_CONTENT = 204;


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