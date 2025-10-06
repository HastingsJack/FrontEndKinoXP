import {apiRequest} from "./modules/apiRequest.js";

const STATUS_BADREQUEST = 400;
const btn = document.getElementById("btn");

btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const loginForm = document.getElementById("loginForm");
    const plainText = new FormData(loginForm);
    const plainObject = Object.fromEntries(plainText);
    const cleanedObject = Object.fromEntries(Object.entries(plainObject)
        .map(([key, value]) => [
            key,
            value === "" ? null : value,
        ]));

    const response = await apiRequest("auth/login", "POST", cleanedObject);

    if (response.status === STATUS_BADREQUEST) {
        const parsedData = JSON.parse(response.data);
        if (parsedData.email !== null)
            document.getElementById("missingEmail").textContent = parsedData.email;
        if (parsedData.password !== null)
            document.getElementById("missingPassword").textContent = parsedData.password;
    }

});