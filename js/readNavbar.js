

console.log("you are in navbar script ");

document.addEventListener('DOMContentLoaded', async e => {
    const navbar = document.getElementById("navbarContainer");
    const response = await (await fetch("./fragment/navbar.html")).text();
    console.log(response)



    navbar.innerHTML = response

    const homeButton = document.getElementById("home")
    homeButton.addEventListener("click", e => {
        e.preventDefault()
        location.href = "./index.html"
    })

    const snackButton = document.getElementById("snacks")
    snackButton.addEventListener("click", e => {
        e.preventDefault()
        location.href = "./get-snacks.html"
    })

    const activeFilms = document.getElementById("activeFilms")
    activeFilms.addEventListener("click", e => {
        e.preventDefault()
        location.href = "./active-films.html"
    })

    const adminEmployeesButton = document.getElementById("adminEmployees")
    adminEmployeesButton.addEventListener("click", e => {
        e.preventDefault()
        location.href = "./admin-view-users.html"
    })

})