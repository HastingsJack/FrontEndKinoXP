const baseurl = "http://localhost:8080"



//here we load the html of the fragment and return it.
async function loadFragment(targetSelector, url) {
    const chosenContaineer = document.getElementById(targetSelector);
    const response = await fetch(url, {})
    chosenContaineer.innerHTML= await response.text()
    return chosenContaineer
}

//here we figure out where we url we are on, to make a decision about what the form should do.
function getStateFromUrl() {
    const parsedParameter = new URLSearchParams(window.location.search)
    const id = parsedParameter.searchParams.get('id')
    if (id) return { mode : "update, id: Number(id) }"}
    return { mode : "create"}
}

function fillForm(form, data) {
    for (const [key, value] of Object.entries(data)) {
        const input = form.elements.namedItem(key);
        if (!input) continue;
        if (input.type === "checkbox") {
            input.checked = Boolean(value);
        } else {
            input.value = value ?? "";
        }
    }
}

function formDataToPayload(form) {
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.age) data.age = Number(data.age);
    if (data.role) data.role = String(data.role).toUpperCase();
    return data;
}

async function initUserForm() {

    await loadFragment("#formContainer", "./fragment/userForm.html");


    const form = document.querySelector("#userForm");
    const submitButton = form.querySelector("#submitButton");

    // detect mode from URL
    const state = getFormStateFromUrl();


    if (state.mode === "update") {
        submitButton.textContent = "Update user";
        try {

            const res = await fetch(`${baseurl}/admin/users/${state.id}`);
            if (!res.ok) throw new Error("Failed to load user");
            const user = await res.json();
            fillForm(form, user);
        } catch (err) {
            console.error(err);
            alert("Could not load user data.");
            return;
        }
    } else {
        submitButton.textContent = "Create user";
    }


    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        submitButton.disabled = true;

        try {
            const payload = formDataToPayload(form);

            const url =
                state.mode === "update"
                    ? `${baseurl}/admin/update/${state.id}`
                    : `${baseurl}/admin/create`;

            const method = state.mode === "update" ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Request failed with ${res.status}`);
            }

            const result = await res.json();
            console.log(result);

            // back to adminview
            location.href = "./users.html";
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Check console for details.");
        } finally {
            submitButton.disabled = false;
        }
    });
}


document.addEventListener("DOMContentLoaded", initUserForm);


