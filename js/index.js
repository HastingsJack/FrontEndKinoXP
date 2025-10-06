import { apiRequest } from "./modules/apiRequest.js";

const btn = document.getElementById("btn");

btn.addEventListener("click", async () => {
    const loginForm = document.getElementById("loginForm");
    const plainText = new FormData(loginForm);
    const plainObject = Object.fromEntries(plainText);

    const response = await apiRequest("auth/login", "POST", plainObject);

    const data = await response.data;

    console.log("data: " + data);
});