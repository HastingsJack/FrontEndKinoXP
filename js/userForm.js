const baseurl = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", async () => {
    //loads the fragment into the container
    const container = document.querySelector("#formContainer");
    container.innerHTML = await (await fetch("./fragment/userForm.html")).text();

    //grabbing  the form and mode from url
    const form = document.querySelector("#userForm");
    const btn  = form.querySelector("#submitButton");
    const id   = new URLSearchParams(location.search).get("id");
    //its for update if url contains a numberid
    const isUpdate = !!id;

    // if it is an update we fill out the form
    if (isUpdate) {
        btn.textContent = "Update user";

        //fetching existing userdata for fill out
        const res = await fetch(`${baseurl}/admin/users/${Number(id)}`);

        //message if we couldn't find the user
        if (!res.ok) return alert("Could not load user");

        //converts response to an object
        const user = await res.json();

        //looping over the key value pairs we recieved of the user object since Object.entries(user) returns an array of key value pairs.
        for (const [k, v] of Object.entries(user)) {
            //we find each key value pair's value with the key
            const el = form.elements.namedItem(k);
            // if we didnt find a form element we skip
            if (!el) continue;
            el.type === "checkbox" ? (el.checked = !!v) : (el.value = v ?? "");
        }
    //if not update we just change the button text
    } else {
        btn.textContent = "Create user";
    }

    //setting the endpoint and contacting it
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        btn.disabled = true;

        try {
            // Collect + normalize data
            const data = Object.fromEntries(new FormData(form).entries());
            if (data.age)  data.age  = Number(data.age);
            if (data.role) data.role = String(data.role).toUpperCase();

            //if it isUpdate then we cintact the update endpoint with a put method, and vice versa
            const url    = isUpdate ? `${baseurl}/admin/update/${Number(id)}` : `${baseurl}/admin/create`;
            const method = isUpdate ? "PUT" : "POST";

            //actually submitting our request
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error(await res.text());
            await res.json();

            //go back to the admin view
            location.href = "./admin-view-users.html";
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        } finally {
            btn.disabled = false;
        }
    });
});
