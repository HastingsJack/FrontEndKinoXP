const baseurl = "http://localhost:8080";

const DAY_START_HOUR = 9;
const DAY_END_HOUR = 23;

const TOTAL_MINUTES = (DAY_END_HOUR - DAY_START_HOUR) * 60;
const COLUMN_HEIGHT = 840;
const PX_PER_MINUTES = COLUMN_HEIGHT /TOTAL_MINUTES;

console.log("you are in the weeklySchedule script")

const normalizedDays = d => ((d.getDay() + 6) % 7) + 1;
const normalizedTime = t => (typeof t === "string" ? t.slice(0, 5) : "");

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

    const a = document.createElement("a");
    a.href = "#0";

    const start = normalizedTime(shift.startTime);
    const end = normalizedTime(shift.endTime);
    a.dataset.start = start
    a.dataset.end = end

    a.dataset.content = "shift"
    a.dataset.event = "event-1"

    const rect = computeBlockRect(start, end);
    a.style.position = "absolute";
    a.style.top = `${rect.top}px`
    a.style.height = `${rect.height}px`;

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


