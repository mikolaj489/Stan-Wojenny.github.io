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
        let gameEnded = true;
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

let gameWon1 = parseInt(getCookie('gameWon1'), 10) || 0; // Wczytaj liczbę wygranych z ciasteczek lub ustaw 0

function incrementWinCookie() {
    gameWon1++; // Zwiększ licznik wygranych
    setCookie('gameWon1', gameWon1, 1); // Zapisz nową wartość do ciasteczek
    console.log(`Liczba wygranych (gameWon1): ${gameWon1}`);
}

    const draggables = document.querySelectorAll('.draggable');
    const dropzones = document.querySelectorAll('.dropzone');
    const nameContainer = document.querySelector('.name-container');
    const result = document.getElementById('result');
    const result2 = document.getElementById('result2');
    const totalItems = draggables.length;
    let matchedItems = 0;

    const playButton = document.getElementById('play');
    const infocard = document.getElementById('info');

    let timer = 25;
    let timerInterval;
    const timerElement = document.getElementById('timer');

    function startTimer() {
        timerInterval = setInterval(() => {
            let minutes = Math.floor(timer / 60);
            let seconds = timer % 60;
            timerElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            
            if (timer <= 0) {
                clearInterval(timerInterval);
                if (matchedItems < totalItems) {
                    result2.style.display = 'flex';
                    blockGame();
                
                }
            }
            timer--;
        }, 1000);
    }

    function shuffleNames() {
        const names = Array.from(nameContainer.children);
        for (let i = names.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            nameContainer.appendChild(names[j]);
        }
    }

  
    let lives = 2;  // Gracz zaczyna z 1 życiem
const livesCountElement = document.getElementById('lives-count');  // Element, który będzie wyświetlał liczbę żyć

// Zaktualizowana funkcja dropElement z obsługą życia
function dropElement(draggable, dropzone) {
    const personName = draggable.textContent.trim();
    const correctName = dropzone.dataset.name;

    if (personName === correctName) {
        if (!dropzone.querySelector('.name-label')) {
            const nameLabel = document.createElement('span');
            nameLabel.classList.add('name-label');
            nameLabel.textContent = personName;
            nameLabel.style.color = "#181818";
            nameLabel.style.backgroundColor = "white";
            dropzone.appendChild(nameLabel);
        }

        const spanToRemove = dropzone.querySelector('span');
        if (spanToRemove && spanToRemove.textContent === 'Upuść tutaj') {
            spanToRemove.remove();
        }

        draggable.setAttribute('draggable', 'false');
        draggable.style.cursor = 'default';

        const nameDiv = Array.from(nameContainer.children).find(div => div.textContent.trim() === personName);
        if (nameDiv) {
            nameDiv.remove();
        }

        matchedItems++;
        if (matchedItems === totalItems) {
            result.style.display = 'flex';
            clearInterval(timerInterval);
            incrementWinCookie(); // Zwiększ licznik wygranych w ciasteczkach
        }
    } else {
        // Jeśli odpowiedź jest błędna, zmniejszamy życie
        lives--; 
        livesCountElement.textContent = lives;  // Aktualizujemy wyświetlaną liczbę żyć
        
        if (lives <= 0) {
            // Jeśli nie ma życia, blokujemy grę i pokazujemy komunikat
            blockGame();
            result2.style.display = 'flex';  // Komunikat o przegranej
            clearInterval(timerInterval);
            
        } else {
            console.log(`Masz ${lives} życia.`);
        }

        // Jeśli odpowiedź była błędna, przywracamy pozycję elementu
        draggable.style.position = 'static';
        draggable.style.left = '';
        draggable.style.top = '';
    }
}



function blockGame() {
    draggables.forEach(draggable => {
        draggable.setAttribute('draggable', 'false');
        draggable.style.cursor = 'default';
    });
    dropzones.forEach(dropzone => {
        dropzone.removeEventListener('dragover', handleDragOver);
        dropzone.removeEventListener('dragleave', handleDragLeave);
        dropzone.removeEventListener('drop', handleDrop);
    });
    nameContainer.style.display = 'none';
}

// Zaktualizowana funkcja startująca timer

    function handleDragOver(e) { if( gameEnded) return;e.preventDefault(); e.target.classList.add('highlight'); }
    function handleDragLeave(e) { if( gameEnded) return;e.target.classList.remove('highlight'); }
    function handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('highlight');
        const draggable = document.querySelector('.dragging');
        dropElement(draggable, e.target);
    }

    draggables.forEach(draggable => {
        draggable.addEventListener('mousedown', (e) => {
            e.preventDefault();
            draggable.classList.add('dragging');
            
            const offsetX = e.clientX - draggable.getBoundingClientRect().left;
            const offsetY = e.clientY - draggable.getBoundingClientRect().top;

            
            const handleMouseMove = (e) => {
                if( gameEnded) return;
                draggable.style.position = 'absolute';
                draggable.style.left = `${e.clientX - offsetX}px`;
                draggable.style.top = `${e.clientY - offsetY}px`;
            };

            const handleMouseUp = (e) => {
                if( gameEnded) return;
                const dropzone = findDropzone(e.clientX, e.clientY);
                if (dropzone) {
                    dropElement(draggable, dropzone);
                } else {
                    draggable.style.position = 'static';
                    draggable.style.left = '';
                    draggable.style.top = '';
                }
                draggable.classList.remove('dragging');
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        draggable.addEventListener('touchstart', (e) => {
            if( gameEnded) return;
            e.preventDefault();
            draggable.classList.add('dragging');
            const touch = e.touches[0];
            draggable.style.position = 'absolute';
            draggable.style.left = `${touch.pageX - draggable.offsetWidth / 2}px`;
            draggable.style.top = `${touch.pageY - draggable.offsetHeight / 2}px`;
        });

        draggable.addEventListener('touchmove', (e) => {
            if( gameEnded) return;
            const touch = e.touches[0];
            draggable.style.left = `${touch.pageX - draggable.offsetWidth / 2}px`;
            draggable.style.top = `${touch.pageY - draggable.offsetHeight / 2}px`;
        });

        draggable.addEventListener('touchend', (e) => {
            if( gameEnded) return;
            const dropzone = findDropzone(draggable.offsetLeft, draggable.offsetTop);
            if (dropzone) {
                dropElement(draggable, dropzone);
            } else {
                draggable.style.position = 'static';
                draggable.style.left = '';
                draggable.style.top = '';
            }
            draggable.classList.remove('dragging');
        });
    });

    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover', handleDragOver);
        dropzone.addEventListener('dragleave', handleDragLeave);
        dropzone.addEventListener('drop', handleDrop);
    });

    playButton.addEventListener('click', () => {
    infocard.style.display = 'none';
    startTimer();
    gameEnded=false;
});

    function findDropzone(x, y) {
        if( gameEnded) return;
        return Array.from(dropzones).find(dropzone => {
            const rect = dropzone.getBoundingClientRect();
            return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
        });
    }
    document.addEventListener('DOMContentLoaded', () => {
    shuffleNames();  // Shuffle names right when the page loads
 
});