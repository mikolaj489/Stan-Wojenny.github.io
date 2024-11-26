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

  var gameEnded = true;
   

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
// Funkcja tasowania elementów w kontenerze
function shuffle(containerId) {
  const container = document.getElementById(containerId);
  const items = Array.from(container.children);

  // Tasowanie za pomocą algorytmu Fisher-Yates
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  // Czyszczenie kontenera i dodanie przetasowanych elementów
  container.innerHTML = '';
  items.forEach(item => container.appendChild(item));
}

// Wywołanie tasowania pytań i odpowiedzi po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
  shuffle('source'); // Losowanie pytań
  shuffle('target'); // Losowanie odpowiedzi
});

// Zmienne globalne
let activeElement = null;
let matchedCount = 0;

// Pobranie elementów
const questions = document.querySelectorAll('#source div');
const answers = document.querySelectorAll('#target div');
const totalPairs = questions.length;

// Dodanie klasy dla pytań i odpowiedzi
questions.forEach(question => question.classList.add('question'));
answers.forEach(answer => answer.classList.add('answer'));

// Obsługa przeciągania dla komputerów
questions.forEach(item => addDragListeners(item));
answers.forEach(item => addDragListeners(item));

function addDragListeners(item) {
  item.addEventListener('mousedown', (e) => {
    if (gameEnded) return;
    activeElement = item;
    item.style.position = 'absolute';
    item.style.zIndex = '1000';
  });

  document.addEventListener('mousemove', (e) => {
    if (activeElement) {
      activeElement.style.left = `${e.pageX - activeElement.offsetWidth / 2}px`;
      activeElement.style.top = `${e.pageY - activeElement.offsetHeight / 2}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (activeElement) {
      handleDrop();
    }
  });

  item.addEventListener('touchstart', (e) => {
    if (gameEnded) return;
    activeElement = item;
    item.style.position = 'absolute';
    item.style.zIndex = '1000';
  });

  item.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (activeElement) {
      const touch = e.touches[0];
      activeElement.style.left = `${touch.pageX - activeElement.offsetWidth / 2}px`;
      activeElement.style.top = `${touch.pageY - activeElement.offsetHeight / 2}px`;
    }
  });

  item.addEventListener('touchend', () => {
    if (activeElement) {
      handleDrop();
    }
  });
}

// Obsługa upuszczania
function handleDrop() {
  const rect = activeElement.getBoundingClientRect();
  let matched = false;

  const targets = activeElement.classList.contains('question') ? answers : questions;

  targets.forEach(target => {
    const targetRect = target.getBoundingClientRect();

    if (
      rect.left < targetRect.right &&
      rect.right > targetRect.left &&
      rect.top < targetRect.bottom &&
      rect.bottom > targetRect.top
    ) {
      if (activeElement.dataset.match === target.id) {
        activeElement.classList.add('hidden');
        target.classList.add('hidden');
        matched = true;
        matchedCount++;
        checkCompletion();
      }
    }
  });

  if (!matched) {
    activeElement.style.position = '';
    activeElement.style.left = '';
    activeElement.style.top = '';
    activeElement.style.zIndex = '';
  }

  activeElement = null;
}

let timerInterval = null;

function startTimer(duration, displayId, onFinish) {
    let timer = duration;
    const display = document.getElementById(displayId);

    timerInterval = setInterval(() => {
        if (gameEnded) { // If the game ends, stop the timer
            clearInterval(timerInterval);
            timerInterval = null;
            return;
        }

        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;

        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timer <= 0) {
            clearInterval(timerInterval); // Stop the timer
            timerInterval = null;
            if (onFinish) onFinish();
            gameEnded = true; // Mark the game as ended
        }

        timer--;
    }, 1000);
}

function checkCompletion() {
    if (matchedCount === totalPairs) {
        const resultElement = document.getElementById('result');
        resultElement.style.display = 'flex'; // Show the win message
        clearInterval(timerInterval); // Stop the timer
        timerInterval = null; // Reset the interval variable
        gameEnded = true; // Mark the game as ended
        incrementWinCookie(); // Update the win cookie
    }
}

// Funkcja zakończenia gry
function endGame() {
    document.getElementById('result2').style.display = 'flex';
    clearInterval(timerInterval); // Zatrzymanie timera, jeśli jeszcze działa
}


// Rozpoczęcie gry
document.getElementById('play').onclick = function () {
  document.getElementById('info').style.display = 'none';
  document.getElementById('play').style.display = 'none';
  startTimer(150, 'timer', endGame); // Timer na 2:30
  gameEnded = false;
};