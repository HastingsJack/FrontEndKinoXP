const baseurl = "http://localhost:8080"


function createUser (){

}


document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("./fragment/userForm.html");
    const html = await response.text();
    document.querySelector("#formContainer").innerHTML = html})