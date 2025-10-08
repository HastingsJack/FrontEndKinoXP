const baseurl = "http://localhost:8080";
console.log("you are in the weeklySchedule script")
//this is the range in a day
const DAY_START_HOUR = 9;
const DAY_END_HOUR = 23;


// this if for calculating positioning
const TOTAL_MINUTES = (DAY_END_HOUR - DAY_START_HOUR) * 60;
const COLUMN_HEIGHT = 840;
const PX_PER_MINUTES = COLUMN_HEIGHT /TOTAL_MINUTES;



// this is for figuring out the weekly dates
const toYMD = d => d.toISOString().slice(0, 10);

const startOfWeek = d => {
    const date= new Date(d);
    const day = (date.getDay() + 6) % 7;
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - day)
    return date;
}

const endOfWeek = d => {
    const start = startOfWeek(d);
    const end = new Date(start);
    end.setDate(start.getDate()+6)
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


async function loadShiftsForWeek(){
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


    }catch (error) {
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

    const start = normalizedTime(shift.startTime);
    const end = normalizedTime(shift.endTime);
    htmlButtonElement.dataset.start = start
    htmlButtonElement.dataset.end = end
    htmlButtonElement.dataset.id = shift.id;

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


async function loadModalForUpdate(id ){
    console.log("you are in the loadModalForUpdate");
    try {
        const response = await fetch(`${baseurl}/workAssignment/shift/${id}`, {mode: "cors"});
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        const shifts = await response.json();
    } catch (err) {
        console.error(err);
        alert("kunne ikke hente vagter")
    }


}


document.addEventListener("DOMContentLoaded", async () => {
    const target = document.querySelector(".schedule-modal-body")
    if (!target) {
        return console.error("schedule-modal-body is undefined")
    }
    try{
        const res = await fetch("/html/fragment/workingAssignmentForm.html")
        if (!res.ok) {
            throw new Error("failed to fetch workingAssignmentForm");
        }
        target.innerHTML = await res.text();
        const form = document.querySelector("#form-container")
        if (!form) {
            return console.error("form is undefined")
        }
    }catch(e){
        console.error(e);
    }
})


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

document.addEventListener("DOMContentLoaded", () => {
    const closeButtonElement = document.getElementById("schedule-modal-close-button")
    const modalElement = document.getElementById("modal-backdrop");
    closeButtonElement.addEventListener("click", () => {
        console.log("modal closed")
        modalElement.style.display = "none";
    })
})

document.addEventListener("click", () => {
    const openModalButtonElements = document.getElementsByClassName("shift-button");

    Array.from(openModalButtonElements).forEach(button => {
        button.addEventListener("click", () => {
            const modalElement = document.getElementById("modal-backdrop");
            modalElement.style.display = "block";
        })
    })
})