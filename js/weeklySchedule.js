const baseurl = "http://localhost:8080";

console.log("you are in the weeklySchedule script")

const normalizedDays = d => ((d.getDay() + 6) % 7) + 1;

const normalizedTime = t => (typeof t === "string" ? t.slice(0, 5) : "");

function buildSShiftElement(shift) {
    console.log("you are in the buildSShiftElement");
    const li = document.createElement("li");
    li.className = "schedule-shift"

    const a = document.createElement("a");
    a.href = "#0";
    a.dataset.start = normalizedTime(shift.startTime)
    a.dataset.end = normalizedTime(shift.endTime)
    a.dataset.content = "shift"
    a.dataset.event = "event-1"


    const em = document.createElement("em");
    em.className = "shift-employee-name"
    em.textContent = shift.user?.name ?? "ukendt"

    a.appendChild(em)
    li.appendChild(a)
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

document.addEventListener("DOMContentLoaded", loadShifts)


