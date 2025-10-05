const showingDropdown = document.getElementById("showing-select")
const email = document.getElementById("customer-email")
const customerName = document.getElementById("customer-name")
const seat = document.getElementById("seat-coords")
const submitButton = document.getElementById("order-button")

async function getDataTest(){
    const {status, data} = await apiRequest("showings/upcoming?date=2025-09-20");
    console.log(status);
    console.log(data)
    return data
}

async function orderTicket(){

    const dto = {
        id: null,
        customerEmail: email.value,
        customerName: customerName.value,
        seat: seat.value,
        showing: {
            id: showingDropdown.value

        }
    };

    console.log("DTO being sent:", dto);

    try {
        const response = await apiRequest("tickets", "POST", dto);
        console.log("Ticket registered:", response);
        alert("Ticket successfully registered!");
    } catch (err) {
        console.error("Error registering ticket:", err);
        alert("Failed to register ticket.");
    }

}


function fillDropdown(showings){
    showings.forEach(showing =>{
        const option = document.createElement("option")
        option.textContent = "Date:" + showing.date + " Time: " + showing.startTime + " Movie: " + showing.movie.title
        option.value = showing.id
        showingDropdown.appendChild(option)
    })
}


submitButton.addEventListener("click", (event) => {
    event.preventDefault()
    orderTicket()
})


async function init(){
    let data = await getDataTest()
    fillDropdown(data)
}

init()


const STATUS_NO_CONTENT = 204;


// Method has default value GET
// Data has default value null. If set it's the data from a form
/* Url is the endpoint we want to call but only the RequestMapping is added
From the RestController we need to contact */
async function apiRequest(url, method = "GET", data = null) {
    const options = {method, headers: {}};
    // our base url is http://localhost:8080/
    const baseUrl = `http://localhost:8080/${url}`;

    // If data has data, we need to set header type to json and stringify data
    if (data) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
    }

    const response = await fetch(baseUrl, options);

    // Check if response is ok, if not, throw error
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Fejl ${response.status}: ${errorMessage}`);
    }

    // try to parse response as json, if not, return response as text
    try {
        // When we delete, api response has no body. We cant use response.json()
        if (response.status === STATUS_NO_CONTENT) return {status: response.status, data: null};

        // When we get a body, we can use response.json()
        const data = await response.json();
        return {status: response.status, data: data};
    } catch {
        return await response.text();
    }
}





