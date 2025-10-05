let tbody = document.querySelector("tbody");

const baseurl = "http://localhost:8080"
const redirectUrl = "http://localhost:63342/FrontEndKinoXP/html"

console.log("you are in the getUsersScript")



async function fetchUsers() {

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
        const updateButton = document.createElement("button");
        updateButton.type = "button";
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", () => {
            location.href = `${redirectUrl}/userUpdate.html?id=${user.id}`;
        })
        tdActions.appendChild(updateButton);


        tdActions.appendChild(deleteUserButton(user, tr)
        );


        tr.append(tdID, tdName, tdEmail, tdPassword, tdAge, tdRole, tdActions);
        tbody.appendChild(tr);
    }


}


function deleteUserButton(user, tr) {
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        const response = fetch(`${baseurl}/admin/delete/${user.id}`, {
            method: "DELETE",
        })

        if (!response.ok) {
            alert('Failed to delete user');
            return;
        }

        tr.remove();

    })
    return deleteButton;

}


function createUserNavigate() {
    location.href = "userCreate.html"
}

document.getElementById("createButton").addEventListener("click", createUserNavigate)

document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
})