import {apiRequest, readyFormData} from "./modules/apiRequest.js";

const STATUS_BADREQUEST = 400;
const STATUS_OK = 200;
const btn = document.getElementById("btn");
localStorage.clear();

btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const loginForm = document.getElementById("loginForm");
    const plainObject = readyFormData(loginForm);

    const response = await apiRequest("auth/login", "POST", plainObject);

    if (response.status === STATUS_BADREQUEST) {
        const parsedData = JSON.parse(response.data);
        if (parsedData.error !== null)
            document.getElementById("errorMessage").textContent = parsedData.error;
        if (parsedData.email !== null)
            document.getElementById("missingEmail").textContent = parsedData.email;
        if (parsedData.password !== null)
            document.getElementById("missingPassword").textContent = parsedData.password;
    }
    if (response.status === STATUS_OK) {
        localStorage.setItem("credentials", response.data)
        window.location.href = "active-films.html"
    }
});