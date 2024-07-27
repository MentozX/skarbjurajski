let riddles = {};

fetch('riddles.json')
    .then(response => response.json())
    .then(data => riddles = data)
    .catch(error => console.error('Error loading riddles:', error));

function redirectToRiddle() {
    const codeInput = document.getElementById('codeInput').value.toLowerCase();
    const errorMessage = document.getElementById('errorMessage');
    const normalizedRiddles = Object.fromEntries(
        Object.entries(riddles).map(([key, value]) => [key.toLowerCase(), value])
    );

    if (codeInput === "afrodyta") {
        document.getElementById('inputContainer').style.display = 'none';
        document.getElementById('riddleContainer').style.display = 'none';
        document.getElementById('questionContainer').style.display = 'block';
    } else if (normalizedRiddles[codeInput]) {
        if (codeInput === "żubr") {
            showFireworks();
            showCongratsMessage();
        }
        localStorage.setItem('riddle', normalizedRiddles[codeInput]);
        document.getElementById('inputContainer').style.display = 'none';
        document.getElementById('riddleContainer').style.display = 'block';
        displayRiddle();
    } else {
        errorMessage.style.display = 'block';
        startLockout();
    }
}

function showFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    const flash = document.getElementById('flash');
    fireworksContainer.style.display = 'block';
    flash.style.display = 'block';
    flash.style.animation = 'flash 0.5s ease-out';

    setTimeout(() => flash.style.display = 'none', 500);

    const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'cyan'];

    for (let i = 0; i < 30; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = `${Math.random() * 100}vw`;
        firework.style.top = `${Math.random() * 100}vh`;
        firework.style.width = `${Math.random() * 30 + 20}px`;
        firework.style.height = firework.style.width;
        const color = colors[Math.floor(Math.random() * colors.length)];
        firework.style.background = `radial-gradient(circle, ${color}, transparent)`;
        fireworksContainer.appendChild(firework);

        setTimeout(() => firework.remove(), 3000); // Remove firework after animation
    }

    // Hide fireworks after animation completes
    setTimeout(() => {
        fireworksContainer.style.display = 'none';
        fireworksContainer.innerHTML = ''; // Clear fireworks
    }, 3000);
}

function showCongratsMessage() {
    const congratsMessage = document.getElementById('congratsMessage');
    congratsMessage.style.display = 'block';
}

function displayRiddle() {
    const riddleDisplay = document.getElementById('riddleDisplay');
    const riddle = localStorage.getItem('riddle');
    riddleDisplay.innerHTML = riddle ? riddle : 'No riddle to display.';
}

function goBack() {
    document.getElementById('inputContainer').style.display = 'block';
    document.getElementById('riddleContainer').style.display = 'none';
    document.getElementById('congratsMessage').style.display = 'none'; // Hide congrats message
    localStorage.removeItem('riddle');
    document.getElementById('errorMessage').style.display = 'none'; // Hide error message on back
}

function goBackFromQuestion() {
    document.getElementById('inputContainer').style.display = 'block';
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none'; // Hide error message on back
}

function startLockout() {
    const lockoutEndTime = Date.now() + 60000; // Lockout for 1 minute (60000 ms)
    localStorage.setItem('lockoutEndTime', lockoutEndTime);
    disableInput();

    const interval = setInterval(() => {
        const remainingTime = lockoutEndTime - Date.now();
        if (remainingTime <= 0) {
            clearInterval(interval);
            enableInput();
        } else {
            document.getElementById('timer').innerText = `Spróbuj ponownie za ${Math.ceil(remainingTime / 1000)} sekund`;
        }
    }, 1000);
}

function disableInput() {
    const codeInput = document.getElementById('codeInput');
    const submitButton = document.querySelector('button[onclick="redirectToRiddle()"]');
    codeInput.disabled = true;
    submitButton.disabled = true;
    document.getElementById('timer').style.display = 'block';
}

function enableInput() {
    const codeInput = document.getElementById('codeInput');
    const submitButton = document.querySelector('button[onclick="redirectToRiddle()"]');
    codeInput.disabled = false;
    submitButton.disabled = false;
    document.getElementById('timer').style.display = 'none';
    localStorage.removeItem('lockoutEndTime');
}

function checkLockout() {
    const lockoutEndTime = localStorage.getItem('lockoutEndTime');
    if (lockoutEndTime && Date.now() < lockoutEndTime) {
        disableInput();
        const interval = setInterval(() => {
            const remainingTime = lockoutEndTime - Date.now();
            if (remainingTime <= 0) {
                clearInterval(interval);
                enableInput();
            } else {
                document.getElementById('timer').innerText = `Spróbuj ponownie za ${Math.ceil(remainingTime / 1000)} sekund`;
            }
        }, 1000);
    }
}

function checkAnswer() {
    const answerInput = document.getElementById('answerInput').value.toLowerCase();
    const responseDisplay = document.getElementById('responseDisplay');

    const validAnswers = ["zamek ogrodzieniec", "ogrodzieniec"];
    if (validAnswers.includes(answerInput)) {
        responseDisplay.innerHTML = "Nie jestem wejściem ani przejściem w ścianie,<br>Nie używasz klamki, by mnie otworzyć w danej chwili.<br>Moja rola to ujawniać to, co za zewnętrzną granicą,<br>Bez mnie, widok z wnętrza byłby pełen tajemnic.";
        responseDisplay.style.display = 'block';
    } else {
        responseDisplay.innerHTML = "Nieprawidłowa odpowiedź. Spróbuj ponownie.";
        responseDisplay.style.display = 'block';
    }
}

window.onload = checkLockout;
