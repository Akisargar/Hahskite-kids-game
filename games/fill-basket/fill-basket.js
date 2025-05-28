console.log("JS is running");
let score = 0;
let soundEnabled = true;
let currentTarget = 0;
let currentCount = 0;
let currentFruit = '';

const fruits = ['🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🍒', '🥭', '🍍'];
const celebrationEmojis = ['🎉', '✨', '🌟', '⭐', '🎊', '💫'];

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

function playSound(frequency, duration = 0.2, type = 'sine') {
    if (!soundEnabled || !audioContext) return;

    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
        console.log('Audio playback failed');
    }
}

function playSuccessSound() {
    if (!soundEnabled || !audioContext) return;
    
    // Play a happy melody
    const notes = [523, 659, 784, 1047]; // C, E, G, C
    notes.forEach((note, index) => {
        setTimeout(() => {
            playSound(note, 0.3, 'triangle');
        }, index * 150);
    });
}

function generateNewRound() {
    // Generate random target number (1-10)
    currentTarget = Math.floor(Math.random() * 20) + 1;
    currentCount = 0;
    
    // Select random fruit
    currentFruit = fruits[Math.floor(Math.random() * fruits.length)];
    
    // Update display
    document.getElementById('questionNumber').textContent = currentTarget;
    document.getElementById('questionFruit').textContent = currentFruit;
    document.getElementById('buttonFruit').textContent = currentFruit;
    
    // Clear basket
    document.getElementById('basketFruits').innerHTML = '';
    
    // Update progress counter
    updateProgressCounter();
    
    // Clear feedback
    clearFeedback();
}

function addFruit() {
    initAudio();
    
    if (currentCount >= currentTarget) return;
    
    // Add visual effect to button
    const button = document.getElementById('fruitButton');
    button.classList.add('tap-effect');
    setTimeout(() => button.classList.remove('tap-effect'), 400);
    
    // Play tap sound
    playSound(400 + (currentCount * 50), 0.2);
    
    // Add fruit to basket
    const basketFruits = document.getElementById('basketFruits');
    const fruitSpan = document.createElement('span');
    fruitSpan.textContent = currentFruit;
    fruitSpan.classList.add('fruit-add-animation');
    basketFruits.appendChild(fruitSpan);
    
    // Update count
    currentCount++;
    updateProgressCounter();
    
    // Check if target reached
    if (currentCount === currentTarget) {
        setTimeout(() => {
            handleSuccess();
        }, 500);
    }
}

function updateProgressCounter() {
    const counter = document.getElementById('progressCounter');
    counter.textContent = `${currentCount}/${currentTarget} ${currentFruit}`;
    
    // Add animation to counter
    counter.style.animation = 'none';
    setTimeout(() => {
        counter.style.animation = 'basketFill 0.3s ease-out';
    }, 10);
}

function handleSuccess() {
    // Update score
    score++;
    document.getElementById('scoreValue').textContent = score;
    
    // Play success sound
    playSuccessSound();
    
    // Show celebration feedback
    showFeedback('🎉 Perfect! Great Counting! 🎉', '#4ECDC4');
    
    // Create confetti effect
    createConfetti();
    
    // Start new round after delay
    setTimeout(() => {
        generateNewRound();
    }, 3000);
}

function createConfetti() {
    const container = document.querySelector('.game-container');
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (1.5 + Math.random()) + 's';
            
            container.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) confetti.remove();
            }, 2500);
        }, i * 100);
    }
}

function showFeedback(message, color) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.style.color = color;
    feedback.classList.add('show');
    
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 3000);
}

function clearFeedback() {
    const feedback = document.getElementById('feedback');
    feedback.textContent = '';
    feedback.classList.remove('show');
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.querySelector('.sound-toggle');
    btn.textContent = soundEnabled ? '🔊' : '🔇';
    btn.title = soundEnabled ? 'Turn off sound' : 'Turn on sound';
}

function startNewRound() {
    generateNewRound();
}

function startNewGame() {
    score = 0;
    document.getElementById('scoreValue').textContent = '0';
    generateNewRound();
}

// Add keyboard support for accessibility
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        addFruit();
    }
});

// Initialize game
window.addEventListener('load', startNewGame);
document.addEventListener('touchstart', () => initAudio(), { once: true });
document.addEventListener('click', () => initAudio(), { once: true });