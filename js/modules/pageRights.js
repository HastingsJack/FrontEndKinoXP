const user = localStorage.getItem("credentials");


export function checkUser(){
    if(user === null) window.location.href = "login.html"
}

export function checkAdmin(){
    if(user.role !== 'ADMIN') window.location.href = "active-films.html"
}

// Kan vi ikke implementere endnu
/*export function checkOther(){
    if(user.role === 'OTHER') window.location.href = "til vores skema side"
}*/