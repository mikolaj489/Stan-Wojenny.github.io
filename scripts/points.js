window.onload = function () {

    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry.type === 'reload') {
      window.alert(":)");
        // Reset the cookie 'gameWon1'
        setCookie('gameWon1', 0, 1); // Reset value to 0, valid for 1 day

        // Redirect to another page
        window.location.href = "index.html"; // Change to your page's URL
    }
};
// Funkcja do pobierania ciasteczka
  function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return decodeURIComponent(cookie.split('=')[1]);
        }
    }
    return null;
}


function displayPoints() {
    const gameWon1 = getCookie('gameWon1'); // Get the 'gameWon' cookie
    const sumElement = document.getElementById('sum');

    if (gameWon1) {
        sumElement.textContent = `Liczba wygranych: ${gameWon1}`; // Display the value
    } else {
        sumElement.textContent = 'Brak zapisanych wyników'; // If the cookie doesn't exist
    }
}

// Call the function to display the points initially
displayPoints();

// Optionally, update periodically if the cookie changes
setInterval(() => {
    displayPoints();
}, 1000); // Check every second
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure`;
}

// Obsługa kliknięcia przycisku do usunięcia ciasteczka
document.getElementById('delete-cookie').addEventListener('click', () => {
    deleteCookie('gameWon1'); // Usuwamy ciasteczko 'gameWon'
    displayPoints(); // Odświeżamy widok, aby pokazać, że ciasteczko zostało usunięte
});

// Wywołanie funkcji, gdy strona się załaduje
document.addEventListener('DOMContentLoaded', () => {
    displayPoints(); // Wyświetlamy wynik z ciasteczka
});
 // Funkcja generująca losową liczbę w zakresie 1–10000
 function generateRandomNumber() {
            return Math.floor(Math.random() * 10000) + 1;
        }
// Znajdujemy element o id="ID"
const idElement = document.getElementById("ID");
// Generujemy losowy numer
const generatedID = generateRandomNumber();
// Wstawiamy losowy numer do elementu
idElement.textContent = generatedID;
// Cykliczne sprawdzanie i przywracanie ID
setInterval(() => {
    if (idElement.textContent != generatedID) {
        idElement.textContent = generatedID;
    }
}, 100); // Sprawdzanie co 100ms
