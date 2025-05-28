console.log("JS is running");
let score = 0;
let soundEnabled = true;
let gameActive = true;
let balloonInterval;
let balloonCount=0;

const balloonColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB6C1', '#98D8E8'];
const animals = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐸', '🐵', '🐷', '🐻'];
const popSounds = ['Pop!', 'Boom!', 'Wow!', '✨', '🎉', '💥', '⭐'];

let audioContext;

function initAudio() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio not supported');
        }
    }
}

function playPopSound() {
    if (!soundEnabled || !audioContext) return;

    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log('Audio playback failed');
    }
}

function createBalloon(isBomb = false) {
    if (!gameActive) return;

    const balloon = document.createElement('div');
    balloon.className = 'balloon';

    const balloonBody = document.createElement('div');
    balloonBody.className = 'balloon-body';

    let color, face;

    if (isBomb) {
        color = '#FF0000'; // red for bomb
        face = '💣';
    } else {
        color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        face = animals[Math.floor(Math.random() * animals.length)];
    }

    balloonBody.style.background = color;

    const animalFace = document.createElement('div');
    animalFace.className = 'animal-face';
    animalFace.textContent = face;

    const balloonString = document.createElement('div');
    balloonString.className = 'balloon-string';

    balloonBody.appendChild(animalFace);
    balloon.appendChild(balloonBody);
    balloon.appendChild(balloonString);

    const gameArea = document.getElementById('gameArea');
    const maxX = gameArea.offsetWidth - 120;
    const maxY = gameArea.offsetHeight - 180;

    balloon.style.left = Math.max(0, Math.random() * maxX) + 'px';
    balloon.style.top = Math.max(0, Math.random() * maxY) + 'px';

    // Set balloon animation speed based on score
    const speed = score > 20 ? 1 : 2;  // seconds
    balloon.style.animationDuration = speed + 's';
    balloon.style.animationDelay = Math.random() * 2 + 's';

    // Balloon click handler
    balloon.addEventListener('click', () => {
        if (isBomb) {
            endGame();
        } else {
            popBalloon(balloon, color);
        }
    });

    balloon.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (isBomb) {
            endGame();
        } else {
            popBalloon(balloon, color);
        }
    });

    gameArea.appendChild(balloon);

    // Remove balloon after its animation duration if not popped
    setTimeout(() => {
        if (balloon.parentNode) balloon.remove();
    }, speed * 1000 + 2000); // extra 2 sec buffer
}


function popBalloon(balloon, color) {
    if (!gameActive) return;

    initAudio();
    playPopSound();

    score++;
    document.getElementById('scoreValue').textContent = score;

    const popEffect = document.createElement('div');
    popEffect.className = 'pop-animation';
    popEffect.textContent = popSounds[Math.floor(Math.random() * popSounds.length)];
    popEffect.style.left = (balloon.offsetLeft + 50) + 'px';
    popEffect.style.top = (balloon.offsetTop + 60) + 'px';
    popEffect.style.color = color;

    document.getElementById('gameArea').appendChild(popEffect);

    setTimeout(() => {
        if (popEffect.parentNode) popEffect.remove();
    }, 800);

    if (score % 5 === 0) {
        showCelebration();
    }

    balloon.remove();
}

function showCelebration() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.textContent = '🎉 Great Job! 🎉';
    document.body.appendChild(celebration);

    setTimeout(() => {
        if (celebration.parentNode) celebration.remove();
    }, 2000);
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.querySelector('.sound-toggle');
    btn.textContent = soundEnabled ? '🔊' : '🔇';
    btn.title = soundEnabled ? 'Turn off sound' : 'Turn on sound';
}

function startNewGame() {
    score = 0;
    balloonCount = 0;
    gameActive = true;

    document.getElementById('scoreValue').textContent = '0';

    // Reset visibility
    document.querySelector('.game-container').style.display = 'block';
    document.getElementById('gameOverScreen').style.display = 'none';

    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';

    if (balloonInterval) clearInterval(balloonInterval);

    createBalloon(); balloonCount++;
    createBalloon(); balloonCount++;

    balloonInterval = setInterval(() => {
        if (!gameActive) return;
        balloonCount++;

        if (balloonCount % 4 === 0) {
            createBalloon(true); // bomb
        } else if (Math.random() < 0.8) {
            createBalloon();
        }
    }, 2000);
}


function endGame() {
    gameActive = false;
    clearInterval(balloonInterval);

    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';

    // Show Game Over screen
    document.getElementById('finalScore').textContent = `Your Score: ${score}`;
    document.getElementById('gameOverScreen').style.display = 'flex';
}
document.getElementById('restartBtn').addEventListener('click', () => {
    document.getElementById('gameOverScreen').style.display = 'none';
    startNewGame();
});




// Initialize game on load
window.addEventListener('load', startNewGame);

// Touch init for mobile audio context unlock
document.addEventListener('touchstart', () => initAudio(), { once: true });
document.addEventListener('click', () => initAudio(), { once: true });
document.querySelectorAll('.restart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('gameOverScreen').style.display = 'none';
        startNewGame();
    });
});