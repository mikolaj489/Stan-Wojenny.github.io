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


let gameWon1 = parseInt(getCookie('gameWon1'), 10) || 0; // Wczytaj licznik wygranych lub ustaw 0

function incrementWinCookie() {
    gameWon1++;
    setCookie('gameWon1', gameWon1, 1); // Zapisz nową wartość
    console.log(`Liczba wygranych (gameWon1): ${gameWon1}`);
}


        const playButton = document.getElementById('play');
        const infocard = document.getElementById('info');
        const questions = [
            { question: "W którym roku urodził się Popiełuszko?", options: ["1947r.", "1946r.", "1948r."], correct: "1947r." },
            { question: "W jakiej miejscowości urodził się Popiełuszko?", options: ["Okopy", "Jedlnia", "Warszawa"], correct: "Okopy" },
            { question: "Od którego roku Popiełuszko jawnie wspierał 'Solidaroność'?", options: ["1980r.", "1979r.", "1981r."], correct: "1980r." },
            { question: "W którym roku Popiełuszko ukończył seminarium w Warszawie?", options: ["1972r.", "1971r.", "1970r."], correct: "1972r." },
            { question: "Którego dnia października Popiełuszko został uprowadzony.", options: ["19", "18", "20"], correct: "19" },
            { question: "Czy Popiełuszko nadal żyje?", options: ["Nie", "Tak", "Nie Wiem"], correct: "Nie"},
            { question: "Jakie masze organizował Popiełuszko za stanu wojennego?", options: ["za Ojczyznę", "za Walczących", "za Misje"], correct: "za Ojczyznę"}
        ];

        let lives = 3;
        let currentQuestionIndex = 0;
        let timeoutId;
        const livesElement = document.getElementById('lives');
        const questionElement = document.getElementById('question');
        const optionsElement = document.getElementById('options');
        const gameOverElement = document.getElementById('result2');
        const winElement = document.getElementById('result');

        function startGame() {
    shuffleArray(questions);
    nextQuestion();
}

function nextQuestion() {
    if (lives <= 0) return; // Stop if game is over

    if (currentQuestionIndex >= questions.length) {
        winGame(); // Wygrana
        return;
    }

    const questionData = questions[currentQuestionIndex];
    shuffleArray(questionData.options);

    questionElement.textContent = questionData.question;

    // Usuń poprzednią zawartość opcji i animacje
    optionsElement.innerHTML = '';
    optionsElement.classList.remove('falling'); // Usuń animację przed dodaniem nowych opcji

    // Dodaj nowe opcje
    questionData.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option');
        button.onclick = () => checkAnswer(option, questionData.correct);
        optionsElement.appendChild(button);
    });

    // Dodaj animację spadania z opóźnieniem, aby efekt był widoczny
    setTimeout(() => {
        optionsElement.classList.add('falling');
    }, 100); // Krótkie opóźnienie na usunięcie poprzedniej animacji

    // Ustaw timeout na automatyczną utratę życia
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        loseLife(); // Utrata życia
        currentQuestionIndex++;
        nextQuestion(); // Wyświetl nowe pytanie
    }, 7000);
}

function checkAnswer(selected, correct) {
    clearTimeout(timeoutId); // Stop timeout when user answers
    if (selected === correct) {
        currentQuestionIndex++;
        optionsElement.classList.remove('falling'); // Usuń animację
        nextQuestion();
    } else {
        loseLife(); // Utrata życia przy błędnej odpowiedzi
        currentQuestionIndex++;
        optionsElement.classList.remove('falling'); // Usuń animację
        nextQuestion(); // Przejdź do kolejnego pytania
    }
}

function loseLife() {
    lives--;
    livesElement.textContent = lives;

    if (lives <= 0) {
        gameOver();
    }
}

function winGame() {
    questionElement.style.display = 'none';
    optionsElement.style.display = 'none';
    winElement.style.display = 'flex';

    incrementWinCookie(); // Zwiększ licznik wygranych
}

function gameOver() {
    questionElement.style.display = 'none';
    optionsElement.style.display = 'none';
    gameOverElement.style.display = 'flex';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


playButton.addEventListener('click', () => {
    startGame();
    infocard.style.display = 'none';
});
    