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


let gameWon1 = parseInt(getCookie('gameWon1'), 10) || 0; // Wczytanie liczby wygranych z ciasteczek

function incrementWinCookie() {
    gameWon1++; // Zwiększ licznik wygranych
    setCookie('gameWon1', gameWon1, 1); // Zapisz nową wartość do ciasteczek
    console.log(`Liczba wygranych (gameWon1): ${gameWon1}`);
}


const playButton = document.getElementById('play');
const infocard = document.getElementById('info');
// Zmienne do timera
let timeLeft = 180; // Czas w sekundach
let timerInterval; // Zmienna przechowująca interval timera

// Timer kontener i wynik
const timerElement = document.getElementById('timer');
const resultContainer1 = document.getElementById('result');
const resultContainer2 = document.getElementById('result2');

// Zmienna kontrolująca stan gry (czy upłynął czas)
let gameEnded = true;

// Funkcja odliczania czasu
function startTimer() {
    timerInterval = setInterval(function () {
        // Zmniejsz czas o 1 sekundę
        timeLeft--;

        // Uaktualnij widoczność timera
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // Sprawdź, czy czas się skończył
        if (timeLeft <= 0) {
            clearInterval(timerInterval); // Zatrzymaj timer
            showLostMessage(); // Pokaż komunikat o przegranej
        }
    }, 1000);
}

// Funkcja, która pokazuje komunikat o przegranej
function showLostMessage() {
    resultContainer2.style.display = 'flex'; // Wyświetl komunikat o przegranej
    gameEnded = true; // Ustaw, że gra się skończyła
    removeTouchEventListeners(); // Usuń nasłuchiwacze dotyku
    removeDragEventListeners();  // Usuń nasłuchiwacze przeciągania
}

// Funkcja do usunięcia nasłuchiwaczy dotyku
function removeTouchEventListeners() {
    images.forEach(img => {
        img.removeEventListener('touchstart', touchStartMobile);
        img.removeEventListener('touchmove', touchMoveMobile);
        img.removeEventListener('touchend', touchEndMobile);
    });

    slots.forEach(slot => {
        slot.removeEventListener('touchend', touchDropMobile);
    });
}

// Funkcja do usunięcia nasłuchiwaczy przeciągania
function removeDragEventListeners() {
    images.forEach(img => {
        img.removeEventListener('dragstart', dragStartDesktop);
        img.removeEventListener('dragend', dragEndDesktop);
    });

    slots.forEach(slot => {
        slot.removeEventListener('dragover', dragOverDesktop);
        slot.removeEventListener('drop', handleDropDesktop);
    });
}

// Start timera po załadowaniu strony
window.addEventListener('load', () => {
    shuffleElements(document.getElementById('elementy'));
});

// Pobranie obrazków i slotów
const images = document.querySelectorAll('#elementy img');
const slots = document.querySelectorAll('#plansza div');
const resultContainer = document.getElementById('result'); // Div z wynikiem

// Przetasowanie obrazków na starcie
window.addEventListener('load', () => {
    shuffleElements(document.getElementById('elementy'));
});

// Dodanie obsługi zdarzeń dla przeciągania i dotyku
images.forEach(img => {
    img.addEventListener('dragstart', dragStartDesktop);
    img.addEventListener('dragend', dragEndDesktop);

    // Obsługa dotyku na urządzeniach mobilnych
    img.addEventListener('touchstart', touchStartMobile);
    img.addEventListener('touchmove', touchMoveMobile);
    img.addEventListener('touchend', touchEndMobile);
});

// Obsługa slotów
slots.forEach(slot => {
    slot.addEventListener('dragover', dragOverDesktop);
    slot.addEventListener('drop', handleDropDesktop);

    // Obsługa dotyku na slotach
    slot.addEventListener('touchend', touchDropMobile);
});

// Zmienne globalne do śledzenia przeciąganych elementów
let originalSlot = null;
let currentDraggedImage = null;
let currentHoveredSlot = null; // Do śledzenia slotu podczas dotyku

// --- Obsługa przeciągania na komputerze ---
function dragStartDesktop(e) {
    if (gameEnded) return; // Jeśli gra się skończyła, nie rób nic

    originalSlot = this.parentElement; // Zapamiętaj oryginalny slot
    e.dataTransfer.setData('text', this.id); // Przekaż ID obrazka
    currentDraggedImage = this; // Zapamiętaj przeciągany obrazek
}

function dragEndDesktop() {
    if (gameEnded) return; // Jeśli gra się skończyła, nie rób nic

    originalSlot = null; // Wyczyść oryginalny slot
    currentDraggedImage = null; // Wyczyść przeciągany obrazek
}

function dragOverDesktop(e) {
    if (gameEnded) return; // Jeśli gra się skończyła, nie rób nic

    e.preventDefault();
}

function handleDropDesktop(e) {
    if (gameEnded) return; // Jeśli gra się skończyła, nie rób nic

    e.preventDefault();
    const draggedImageId = e.dataTransfer.getData('text'); // Pobierz ID obrazka
    const draggedImage = document.getElementById(draggedImageId); // Znajdź obrazek
    const targetSlot = this; // Slot docelowy

    // Zamiana, jeśli obrazek nie jest w tym samym slocie
    if (targetSlot !== originalSlot) {
        swapImages(targetSlot, draggedImage);
        checkSlots(); // Sprawdź dopasowanie
    }
}

// Funkcja dotyku, która działa tylko jeśli gra nie jest zakończona
function touchStartMobile(e) {
    if (gameEnded) return; // Jeśli gra się skończyła, nie rób nic

    originalSlot = this.parentElement; // Zapamiętaj oryginalny slot
    currentDraggedImage = this; // Zapamiętaj przeciągany obrazek
    e.target.style.zIndex = 1000; // Ustawienie obrazka na wierzchu
    e.target.style.position = 'absolute'; // Ustawienie pozycji na absolute
    e.target.style.pointerEvents = 'none'; // Wyłączenie zdarzeń na obrazku
}

function touchMoveMobile(e) {
    if (gameEnded) return; // Jeśli gra się skończyła, nie rób nic

    e.preventDefault(); // Wyłącz domyślne zachowanie (np. przewijanie)

    // Pobierz współrzędne dotyku
    const touch = e.changedTouches[0];

    // Ustawienie pozycji obrazka zgodnie z dotykiem
    if (currentDraggedImage) {
        currentDraggedImage.style.left = `${touch.clientX - currentDraggedImage.offsetWidth / 2}px`;
        currentDraggedImage.style.top = `${touch.clientY - currentDraggedImage.offsetHeight / 2}px`;
    }
}

function touchEndMobile(e) {
    if (gameEnded) return; // Jeśli gra się skończyła, nie rób nic

    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

    if (dropTarget) {
        if (dropTarget.tagName === 'IMG' && dropTarget !== currentDraggedImage) {
            // Zamiana z innym obrazkiem
            const targetSlot = dropTarget.parentElement;
            swapImages(targetSlot, currentDraggedImage);
        } else if (dropTarget.tagName === 'DIV' && dropTarget.id.startsWith('slot')) {
            // Zamiana z pustym slotem
            swapImages(dropTarget, currentDraggedImage);
        }
    }

    // Przywrócenie stylu obrazka
    if (currentDraggedImage) {
        currentDraggedImage.style.position = 'static'; // Przywrócenie pierwotnej pozycji
        currentDraggedImage.style.zIndex = 'auto'; // Przywrócenie domyślnego z-index
        currentDraggedImage.style.pointerEvents = 'auto'; // Przywrócenie zdarzeń
    }

    originalSlot = null;
    currentDraggedImage = null;

    checkSlots(); // Sprawdź dopasowanie
}


function touchDropMobile(e) {
    if (gameEnded) return; // Jeśli gra się skończyła, nie rób nic

    e.preventDefault();
    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

    if (dropTarget && dropTarget.tagName === 'DIV' && dropTarget.id.startsWith('slot') && currentDraggedImage) {
        swapImages(dropTarget, currentDraggedImage);
    }
}


// --- Wspólna logika ---
function swapImages(targetSlot, draggedImage) {
    const targetImage = targetSlot.querySelector('img'); // Obrazek w slocie docelowym

    // Zamień obrazki, jeśli slot docelowy zawiera obrazek
    if (targetImage instanceof Node) {
        originalSlot.appendChild(targetImage); // Przenieś obrazek do oryginalnego slotu
    }

    // Przenieś przeciągany obrazek do slotu docelowego
    targetSlot.appendChild(draggedImage);
}

function shuffleElements(container) {
    const elements = Array.from(container.children);
    const shuffledElements = elements.sort(() => Math.random() - 0.5);
    shuffledElements.forEach(element => container.appendChild(element));
}
// Funkcja sprawdzająca, czy wszystkie sloty mają odpowiednie obrazki
function checkSlots() {
    let allMatched = true;

    slots.forEach(slot => {
        const img = slot.querySelector('img'); // Pobierz obrazek w slocie
        if (img) {
            const slotId = slot.id.replace('slot', ''); // Pobierz numer slotu
            const imgId = img.id.replace('img', ''); // Pobierz numer obrazka
            if (slotId !== imgId) {
                allMatched = false; // Jeśli slot i obrazek nie pasują, ustaw na false
            }
        } else {
            allMatched = false; // Jeśli slot jest pusty, ustaw na false
        }
    });

    if (allMatched) {
        showWinMessage(); // Wyświetl komunikat o wygranej
    }
}

// Funkcja pokazująca komunikat o wygranej
function showWinMessage() {
    resultContainer1.style.display = 'flex'; // Wyświetl komunikat o wygranej
    gameEnded = true; // Ustaw, że gra się skończyła
    clearInterval(timerInterval); // Zatrzymaj timer
    removeTouchEventListeners(); // Usuń nasłuchiwacze dotyku
    removeDragEventListeners(); // Usuń nasłuchiwacze przeciągania

    incrementWinCookie(); // Zwiększ licznik w ciasteczkach
}
playButton.addEventListener('click', () => {
    startTimer();
    infocard.style.display = 'none';
    gameEnded = false;
});
    
    