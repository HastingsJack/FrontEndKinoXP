document.addEventListener('DOMContentLoaded', async () => {
    const navbar = document.getElementById("navbarContainer");
    navbar.innerHTML = await (await fetch("./fragment/navbar.html")).text();

    const snackButton = document.getElementById("snacks")
    snackButton.addEventListener("click", (e) => {
        e.preventDefault()
        location.href = "./get-snacks.html"
    });

    const activeFilms = document.getElementById("activeFilms")
    activeFilms.addEventListener("click", (e) => {
        e.preventDefault()
        location.href = "./active-films.html"
    });

    const adminEmployeesButton = document.getElementById("adminEmployees")
    adminEmployeesButton.addEventListener("click", (e) => {
        e.preventDefault()
        location.href = "./admin-view-users.html"
    });

    const adminMoviesButton = document.getElementById("addMovie")
    adminMoviesButton.addEventListener("click", (e) => {
        e.preventDefault()
        location.href = "./add-movie.html"
    });

    const logoutButton = document.getElementById("logout")
    logoutButton.addEventListener("click", (e) => {
        e.preventDefault()
        localStorage.clear()
        location.href = "./index.html"
    });

})