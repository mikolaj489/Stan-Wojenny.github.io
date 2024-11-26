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
      function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        const expiresString = `expires=${expires.toUTCString()}`;
    
        // Ustawienie ciasteczka z atrybutem SameSite=None oraz Secure
        document.cookie = `${name}=${encodeURIComponent(value)}; ${expiresString}; path=/; SameSite=None; Secure`;
    }
    
    
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
    
    function incrementGameWonCookie() {
        let currentValue = getCookie('gameWon1');
        if (currentValue) {
            // Jeśli ciasteczko już istnieje, zwiększamy jego wartość o 1
            currentValue = parseInt(currentValue) + 1;
        } else {
            // Jeśli ciasteczko nie istnieje, ustawiamy na 1
            currentValue = 1;
        }
    
        // Ustawiamy nowe ciasteczko z zaktualizowaną wartością
        setCookie('gameWon1', currentValue, 1);
        console.log(`Wartość ciasteczka 'gameWon1' to teraz: ${currentValue}`);
    }
    
    const screenLock = document.getElementById('info');
    const pairs = [
        { left: "Andrzej Gwiazda", right: "Współ-założyciel NSZZ" },
        { left: "Ukończona uczelnia Andrzeja Gwiazdy", right: "Politechnika Gdańska" },
        { left: "Joanna Duda-Gwiazda", right: "Żona Andrzeja Gwiazdy" },
        { left: "Zorganizował Andrzej Gwiazda", right: "Strajk w Stoczni Gdańskiej" },
        { left: "Liczba postulatów", right: "21" },
        { left: "Powód napiętych relacji Andrzeja Gwiazdy z Wałęsą", right: "Różnica strategii działania" },
        { left: "Rok internowania Andrzeja Gwiazdy", right: "1981r." },
        { left: "Krytykował Andrzej Gwiazda", right: "Kompromisy zawarte przy Okrągłym Stole" },
    ];
    
    let cards = [...pairs.map(pair => pair.left), ...pairs.map(pair => pair.right)];
    let shuffledCards = cards.sort(() => Math.random() - 0.5);
    let locked = false;
    let openCards = [];
    let timerInterval;
    let timeLeft = 180;
    
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
    
        for (let i = 0; i < shuffledCards.length; i++) {
            let card = document.createElement('div');
            card.className = 'card';
            card.textContent = shuffledCards[i]; // Widoczny tekst od razu
            
            card.onclick = function () {
                if (locked || this.classList.contains('boxOpen') || this.classList.contains('boxMatch')) return;
    
                this.style.backgroundColor = "rgb(131, 67, 51)";
                this.style.color = 'white';
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
        const firstText = firstCard.textContent;
        const secondText = secondCard.textContent;
    
        const isMatch = pairs.some(pair =>
            (pair.left === firstText && pair.right === secondText) ||
            (pair.right === firstText && pair.left === secondText)
        );
    
        if (isMatch) {
            firstCard.classList.add('boxMatch');
            secondCard.classList.add('boxMatch');
        } else {
            firstCard.classList.remove('boxOpen');
            secondCard.classList.remove('boxOpen');
    
            firstCard.style.backgroundColor = '';
            secondCard.style.backgroundColor = '';
    
            firstCard.style.color = 'black';
            secondCard.style.color = 'black';
        }
    
        openCards = [];
        locked = false;
    
        if (document.querySelectorAll('.boxMatch').length === shuffledCards.length) {
            clearInterval(timerInterval);
            document.getElementById('result').style.display = "flex";
            document.querySelectorAll('.card').forEach(card => card.onclick = null); // Zablokowanie kliknięć
            incrementGameWonCookie(); // Zwiększamy wartość ciasteczka
        }
    }
    
    createCards();
    
    document.getElementById('play').onclick = function () {
        document.getElementById('info').style.display = 'none';
        document.getElementById('play').style.display = 'none';
        startTimer();
        locked = false;
    };
    
    function Block() {
        if (screenLock.style.display === 'flex') {
            locked = true;
        }
    }
    
    Block();
    