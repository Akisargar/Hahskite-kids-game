console.log("JS is running");
let score = 0;
let soundEnabled = true;
let currentTarget = null;
let gameColors = [];

const colors = [
    { name: "Red", value: "#FF6B6B", emoji: "🔴" },
    { name: "Blue", value: "#4ECDC4", emoji: "🔵" },
    { name: "Green", value: "#96CEB4", emoji: "🟢" },
    { name: "Yellow", value: "#FFEAA7", emoji: "🟡" },
    { name: "Purple", value: "#DDA0DD", emoji: "🟣" },
    { name: "Orange", value: "#FFB347", emoji: "🟠" },
    { name: "Pink", value: "#FFB6C1", emoji: "🩷" },
    { name: "Brown", value: "#DEB887", emoji: "🟤" },
    { name: "Black", value: "#000000", emoji: "⚫" },
    { name: "White", value: "#ffffff", emoji: "⚪" }
];

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

function playSound(frequency, duration = 0.2) {
    if (!soundEnabled || !audioContext) return;

    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
        console.log('Audio playback failed');
    }
}

function generateNewRound() {
    // Select random target color
    currentTarget = colors[Math.floor(Math.random() * colors.length)];
    
    // Update target display
    // document.getElementById('targetColor').style.backgroundColor = currentTarget.value
    document.getElementById('targetEmoji').textContent = currentTarget.emoji;
    document.getElementById('targetName').textContent = currentTarget.name;
    document.getElementById('targetColorName').textContent = currentTarget.name.toUpperCase();
    
    // Create array with target color and 3 random other colors
    const otherColors = colors.filter(c => c.name !== currentTarget.name);
    const shuffledOthers = otherColors.sort(() => Math.random() - 0.5).slice(0, 3);
    gameColors = [currentTarget, ...shuffledOthers].sort(() => Math.random() - 0.5);
    
    createColorsGrid();
    clearFeedback(); speak(currentTarget.name);

}

function createColorsGrid() {
    const grid = document.getElementById('colorsGrid');
    grid.innerHTML = '';
    
    gameColors.forEach((color, index) => {
        const button = document.createElement('button');
        button.className = 'color-button';
        // button.style.backgroundColor = color.value;
        button.style.animationDelay = (index * 0.1) + 's';
        button.textContent = color.emoji;
        
        button.addEventListener('click', () => handleColorClick(color, button));
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleColorClick(color, button);
        });
        
        grid.appendChild(button);
    });
}

function speak(text) {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(msg);
    } else {
      console.log('Speech Synthesis not supported in this browser.');
    }
  }
function handleColorClick(selectedColor, button) {
    initAudio();
    
    if (selectedColor.name === currentTarget.name) {
        // Correct answer
        button.classList.add('correct');
        score++;
        document.getElementById('scoreValue').textContent = score;
        
        showFeedback('🎉 Great job! 🎉', '#4ECDC4');
        playSound(523, 0.3); // Happy sound
        speak(currentTarget.name);
        // Generate new round after delay
        setTimeout(() => {
            generateNewRound();
        }, 2000);
        
    } else {
        // Wrong answer
        button.classList.add('wrong');
        showFeedback('Try again! 😊', '#FF6B6B');
        playSound(200, 0.3); // Try again sound
        speak(currentTarget.name);
        // Remove wrong class after animation
        setTimeout(() => {
            button.classList.remove('wrong');
        }, 500);
    }
}

function showFeedback(message, color) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.style.color = color;
    feedback.classList.add('show');
    
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 2000);
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

function startNewGame() {
    score = 0;
    document.getElementById('scoreValue').textContent = '0';
    generateNewRound();
}

// Initialize game
window.addEventListener('load', startNewGame);
document.addEventListener('touchstart', () => initAudio(), { once: true });
document.addEventListener('click', () => initAudio(), { once: true });