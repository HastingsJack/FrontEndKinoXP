

import {apiRequest} from "../modules/apiRequest.js";
const STATUS_NO_CONTENT = 204;

const mainTable = document.getElementById("showing-master-table")

function fillTable(showings){

    let rowCount = showings.length;
    showings.forEach(showing =>{
        let cellCount = 0;
        let row = mainTable.insertRow(-1)

        let cell = row.insertCell(cellCount++)
        cell.innerHTML = showing.id
        cell = row.insertCell(cellCount++)
        cell.innerHTML = showing.price
        cell = row.insertCell(cellCount++)
        cell.innerHTML = showing.startTime.toLocaleString()
        cell = row.insertCell(cellCount++)
        cell.innerHTML = showing.endTime.toLocaleString()


    });



}

async function getData(){
    console.log("hello from getData")
   const {status, data} = await apiRequest("showings/all/dto")
    console.log("status:" + status)
    console.log("DATA: " + data)
    return data


}



async function init() {
    const showings = await getData();
    fillTable(showings);
}

// Call init
init();

/*
async function apiRequest2(url, method = "GET", data = null) {
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
*/