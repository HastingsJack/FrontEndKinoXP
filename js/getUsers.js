let tbody = document.querySelector("tbody");

const baseurl = "http://localhost:8080"
const redirectUrl = "http://localhost:63342/FrontEndKinoXP/html"

console.log("you are in the getUsersScript")
async function fetchUsers () {

    const response = await fetch(`${baseurl}/admin/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    const users = await response.json()
    console.log(users)

    tbody.innerHTML = ""

    for (const user of users) {
        const tr = document.createElement("tr");

        const tdID = document.createElement("td");
        tdID.textContent = user.id ?? ""

        const tdName = document.createElement("td");
        tdName.textContent = user.name ?? ""

        const tdEmail = document.createElement("td");
        tdEmail.textContent = user.email ?? ""

        const tdPassword = document.createElement("td");
        tdPassword.textContent = user.password ?? ""

        const tdAge = document.createElement("td");
        tdAge.textContent = user.age ?? "";

        const tdRole = document.createElement("td");
        tdRole.textContent = user.role ?? ""

        const tdActions = document.createElement("td");
        const updateButton = document.createElement("updateButton");
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", () => {
            location.href = `${redirectUrl}/userUpdate.html?id=${user.id}`;
        })
        tdActions.appendChild(updateButton);

        tr.append(tdID, tdName, tdEmail, tdPassword, tdAge, tdRole, tdActions);
        tbody.appendChild(tr);
    }



}

function createUserNavigate() {
    location.href="userCreate.html"
}

    document.getElementById("createButton").addEventListener("click", createUserNavigate)

    document.addEventListener("DOMContentLoaded", () => {
        fetchUsers();
    })