const form = document.getElementById("formMovie")
const messageDiv = document.getElementById("message");

function fetchMovie(event) {
    event.preventDefault();
    let movieID = document.getElementById("inpCode").value
    let startDate = document.getElementById("startDate").value
    let endDate = document.getElementById("endDate").value

    const body = {
        startDate: startDate,
        endDate: endDate
    };
    fetch(`http://localhost:8080/movies/${movieID}`, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(body)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Kunne ikke finde en film med dette id')
        }
        return response.json();
    }).then(movie => {
        messageDiv.textContent = `Filmen "${movie.title}" er gemt i databasen!`;
        messageDiv.style.color = 'green';

       form.reset()

    })
        .catch(error => {
            messageDiv.textContent = error.message;
            messageDiv.style.color = 'red';
        });

}

form.addEventListener('submit', fetchMovie)