const baseurl = "http://localhost:8080";
let shiftID = ""
console.log("you are in the weeklySchedule script")
//this is the range in a day
const DAY_START_HOUR = 9;
const DAY_END_HOUR = 23;


// this if for calculating positioning
const TOTAL_MINUTES = (DAY_END_HOUR - DAY_START_HOUR) * 60;
const COLUMN_HEIGHT = 840;
const PX_PER_MINUTES = COLUMN_HEIGHT / TOTAL_MINUTES;


// this is for figuring out the weekly dates
const toYMD = d => d.toISOString().slice(0, 10);

const startOfWeek = d => {
    const date = new Date(d);
    const day = (date.getDay() + 6) % 7;
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - day)
    return date;
}

const endOfWeek = d => {
    const start = startOfWeek(d);
    const end = new Date(start);
    end.setDate(start.getDate() + 6)
    return end;
}

let currentWeekStart = startOfWeek(new Date());

function updateWeekLabel() {
    const start = currentWeekStart;
    const end = endOfWeek(start);
    const fmt = (x) => x.toLocaleDateString(undefined, {day: 'numeric', month: 'short', year: 'numeric'});
    document.getElementById("weekLabel").textContent = `${fmt(start)} - ${fmt(end)}`;
}


const normalizedDays = d => ((d.getDay() + 6) % 7) + 1;
const normalizedTime = t => (typeof t === "string" ? t.slice(0, 5) : "");


async function loadShiftsForWeek() {
    updateWeekLabel();

    const start = toYMD(currentWeekStart);
    const end = toYMD(endOfWeek(currentWeekStart));
    const url = `${baseurl}/workAssignment/shifts?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Could not fetch shifts");
        }
        const weeklyShifts = await response.json();

        const dayList = {
            1: document.querySelector("[data-day='1']"),
            2: document.querySelector("[data-day='2']"),
            3: document.querySelector("[data-day='3']"),
            4: document.querySelector("[data-day='4']"),
            5: document.querySelector("[data-day='5']"),
            6: document.querySelector("[data-day='6']"),
            7: document.querySelector("[data-day='7']"),
        }

        Object.values(dayList).forEach(ul => ul && (ul.innerHTML = ''));

        for (const s of weeklyShifts) {
            const day = normalizedDays(new Date(s.date));
            const target = dayList[day];
            if (!target) continue;
            target.appendChild(buildSShiftElement(s))
        }


    } catch (error) {
        alert("kunne ikke hente vagter for denne uge");
    }
}


function parseTimeToMinutes(hhmm) {
    const [hour, minute] = hhmm.split(":").map(Number);
    return hour * 60 + minute;
}

function computeBlockRect(startHHMM, endHHMM) {
    const startMin = parseTimeToMinutes(startHHMM);
    const endMin = parseTimeToMinutes(endHHMM);

    const startFromWindow = Math.max(0, startMin - DAY_START_HOUR * 60);
    const endFromWindow = Math.min(TOTAL_MINUTES, endMin - DAY_START_HOUR * 60);

    const clampedHeightMin = Math.max(0, endFromWindow - startFromWindow);

    return {
        top: startFromWindow * PX_PER_MINUTES,
        height: Math.max(18, clampedHeightMin * PX_PER_MINUTES)
    }

}


function buildSShiftElement(shift) {
    console.log("you are in the buildSShiftElement");
    const li = document.createElement("li");
    li.className = "schedule-shift"

    const htmlButtonElement = document.createElement("button");
    htmlButtonElement.type = "button";
    htmlButtonElement.className = "shift-button";
    htmlButtonElement.dataset.shiftId = String(shift.id)


    const start = normalizedTime(shift.startTime);
    const end = normalizedTime(shift.endTime);
    htmlButtonElement.dataset.start = start
    htmlButtonElement.dataset.end = end

    htmlButtonElement.dataset.content = "shift"
    htmlButtonElement.dataset.event = "event-1"

    const rect = computeBlockRect(start, end);
    htmlButtonElement.style.position = "absolute";
    htmlButtonElement.style.top = `${rect.top}px`
    htmlButtonElement.style.height = `${rect.height}px`;

    const em = document.createElement("em");
    em.className = "shift-employee-name"
    em.textContent = shift.user?.name ?? "ukendt"

    htmlButtonElement.appendChild(em)
    li.appendChild(htmlButtonElement)
    return li;
}

async function loadShifts() {
    console.log("you are in the loadShifts");
    try {
        const response = await fetch(`${baseurl}/workAssignment/shifts`, {mode: "cors"});
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        const shifts = await response.json();


        const dayList = {
            1: document.querySelector("[data-day='1']"),
            2: document.querySelector("[data-day='2']"),
            3: document.querySelector("[data-day='3']"),
            4: document.querySelector("[data-day='4']"),
            5: document.querySelector("[data-day='5']"),
            6: document.querySelector("[data-day='6']"),
            7: document.querySelector("[data-day='7']"),
        }

        Object.values(dayList).forEach(ul => ul && (ul.innerHTML = ''));


        for (const s of shifts) {
            const day = normalizedDays(new Date(s.date));
            const target = dayList[day];
            if (!target) continue;
            target.appendChild(buildSShiftElement(s))
        }

    } catch (err) {
        console.error(err);
        alert("kunne ikke hente vagter")
    }
}

//id is the shift id
async function loadModalForUpdate(id) {
    if (!id) throw new Error("Id på vagt kunne ikke findes")
    let shift = "";
    let users = "";
    const modalElement = document.getElementById("modal-backdrop");
    modalElement.style.display = "block";
    console.log("you are in the loadModalForUpdate");

    try {
        const response = await fetch(`${baseurl}/workAssignment/shift/${id}`, {mode: "cors"});
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        shift = await response.json();


        const usersResponse = await fetch(`${baseurl}/admin/users`, {mode: "cors"});
        if (!usersResponse.ok) {
            throw new Error(`${usersResponse.status} ${usersResponse.statusText}`);
        }
        users = await usersResponse.json();

    } catch (err) {
        console.error(err);
        alert("kunne ikke hente vagter")
    }

    let modalTitle = document.querySelector(".schedule-modal-name");
    modalTitle.innerText = `Shift: ${shift.user.name}` ;

    let modalDetails = document.querySelector(".schedule-modal-headline");

    function getDayName(dateStr, local) {
        let date = new Date(dateStr);
        const lowercase= date.toLocaleDateString(local, {weekday: "long"});
        const firstLetter = lowercase.charAt(0).toUpperCase()
        const remainingLetters = lowercase.slice(1)
        return firstLetter + remainingLetters
    }

    function getDateNumber(date) {
        let dateStr = shift.date;
        return date.substring(8, 10)
    }

    modalDetails.innerText = `${getDayName(shift.date, `da-DK`)} d. ${getDateNumber(shift.date)},   ${shift.startTime} - ${shift.endTime}` ;


    const userDropdown = document.querySelector("#assigned-user")
    userDropdown.innerHTML = "";

    users.forEach(u => {
        const el = document.createElement("option");
        el.textContent = u.name;
        el.value = u.id;
        if (el.value === shift.user?.id) {
            el.selected = true;
        }
        userDropdown.appendChild(el);
    })

    const shiftDate = document.querySelector("#shift-date")
    shiftDate.value = shift.date;


    const toHHMM = v => (typeof v === "string" ? v.slice(0, 5) : "");

    const shiftStartTime = document.querySelector("#start-time")
    shiftStartTime.value = toHHMM(shift.startTime);

    const shiftEndTime = document.querySelector("#end-time")
    shiftEndTime.value = toHHMM(shift.endTime);


}
let form = ""

// --------------- fetching modal-----------------
document.addEventListener("DOMContentLoaded", async () => {
    const target = document.querySelector(".schedule-modal-body")
    if (!target) {
        return console.error("schedule-modal-body is undefined")
    }
    try {
        const res = await fetch("/html/fragment/workingAssignmentForm.html")
        if (!res.ok) {
            throw new Error("failed to fetch workingAssignmentForm");
        }
        target.innerHTML = await res.text();
         form = document.querySelector("#work-assignment-form")
        if (!form) {
            return console.error("form is undefined")
        }
    } catch (e) {
        console.error(e);
    }


})



document.addEventListener("submit", async (event) => {
    if (!event.target.matches("#work-assignment-form")) return
    event.preventDefault()

    const raw = Object.fromEntries(new FormData(event.target).entries())

    //this is fixing the fucked up parameters
    const payload = {
        startTime: raw['start-time'] ? `${raw['start-time']}:00` : null, // "HH:mm:ss"
        endTime:   raw['end-time']   ? `${raw['end-time']}:00`   : null,
        date:      raw['shift-date'] || null,

        user: { id: Number(raw['assigned-user']) }

    };

    const url = `${baseurl}/workAssignment/edit/${shiftID}`
    console.log(url)
    console.log(payload)

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        })
        location.reload()
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result);
    } catch (err) {
        console.error(err);
        alert("kunne ikke opdatere")
    }


})


// --------------- fetching shifts by week-----------------
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("prevWeek").addEventListener("click", () => {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        loadShiftsForWeek()
    });
    document.getElementById("nextWeek").addEventListener("click", () => {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        loadShiftsForWeek();
    });
    loadShiftsForWeek()
})
// --------------- closing modal-----------------

document.addEventListener("DOMContentLoaded", () => {
    const closeButtonElement = document.getElementById("schedule-modal-close-button")
    const modalElement = document.getElementById("modal-backdrop");
    closeButtonElement.addEventListener("click", () => {
        console.log("modal closed")
        modalElement.style.display = "none";
    })
})
// --------------- fillinf out modal -----------------

document.addEventListener("click", () => {
    const openModalButtonElements = document.getElementsByClassName("shift-button");

    Array.from(openModalButtonElements).forEach(button => {
        button.addEventListener("click", (event) => {
            shiftID = event.target.dataset.shiftId;
            loadModalForUpdate(shiftID);
        })
    })

})