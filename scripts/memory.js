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

function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const expiresString = `expires=${expires.toUTCString()}`;

    // Ustawienie ciasteczka z atrybutem SameSite=None oraz Secure
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expiresString}; path=/; SameSite=None; Secure`;
}


// Pobieranie liczby wygranych z ciasteczek
let gameWon1 = parseInt(getCookie('gameWon1'), 10) || 0;
function incrementWinCookie() {
    gameWon1++;
    setCookie('gameWon1', gameWon1, 1); // Zapisz nową wartość
    console.log(`Liczba wygranych została zwiększona do: ${gameWon1}`);
}

      const images = [
    "assets/memory/1.png", "assets/memory/1.png", 
    "assets/memory/2.png", "assets/memory/2.png", 
    "assets/memory/3.png", "assets/memory/3.png", 
    "assets/memory/4.png", "assets/memory/4.png", 
    "assets/memory/5.png", "assets/memory/5.png", 
    "assets/memory/6.png", "assets/memory/6.png", 
    "assets/memory/7.png", "assets/memory/7.png", 
    "assets/memory/8.png", "assets/memory/8.png"
];

let shuffledImages = images.sort(() => (Math.random() > 0.5) ? 1 : -1);
let locked = false;
let openCards = [];
let timerInterval;
let timeLeft = 60; 
function startTimer() {
    const timerElement = document.getElementById('timer');
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            clearInterval(timerInterval);
            document.getElementById('result2').style.display = "flex"; 
            document.querySelectorAll('.card').forEach(card => card.onclick = null); 
        }
    }, 1000);
}

function createCards() {
    const gameBoard = document.querySelector('.game');
    gameBoard.innerHTML = '';

    for (let i = 0; i < shuffledImages.length; i++) {
        let card = document.createElement('div');
        card.className = 'card';
        
        let img = document.createElement('img');
        img.src = "assets/memory/blank.jpg"; 
        card.appendChild(img);

        card.onclick = function () {
            if (gameEnded) return;
            else if (locked || this.classList.contains('boxOpen') || this.classList.contains('boxMatch')) return;
            

            this.classList.add('boxOpen');
            img.src = shuffledImages[i];

            openCards.push(card);

            if (openCards.length === 2) {
                locked = true;
                setTimeout(checkForMatch, 500);
            }
        };

        gameBoard.appendChild(card);
    }
}
function checkForMatch() {
    let [firstCard, secondCard] = openCards;
    let firstImg = firstCard.querySelector('img');
    let secondImg = secondCard.querySelector('img');

    if (firstImg.src === secondImg.src) {
        firstCard.classList.add('boxMatch');
        secondCard.classList.add('boxMatch');
    } else {
        firstCard.classList.remove('boxOpen');
        secondCard.classList.remove('boxOpen');
        firstImg.src = "assets/memory/blank.jpg";
        secondImg.src = "assets/memory/blank.jpg";
    }

    openCards = [];
    locked = false;

    // Sprawdź, czy wszystkie karty zostały dopasowane
    if (document.querySelectorAll('.boxMatch').length === shuffledImages.length) {
        clearInterval(timerInterval); // Zatrzymaj timer
        document.getElementById('result').style.display = "flex"; // Wyświetl komunikat o wygranej
        incrementWinCookie(); // Zwiększ licznik wygranych i zaloguj w konsoli
    }
}



createCards();

document.getElementById('play').onclick = function () {
    document.getElementById('info').style.display = 'none';
    document.getElementById('play').style.display = 'none';
    startTimer();
    gameEnded=false;
};
    