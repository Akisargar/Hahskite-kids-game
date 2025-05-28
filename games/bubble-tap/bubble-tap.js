console.log("JS is running");
let score = 0;
let soundEnabled = true;
let gameActive = true;
let bubbleInterval;
let combo = 0;
let comboTimer = null;

const bubbleTypes = [
    { size: 'small', emoji: '✨', points: 1, frequency: 600 },
    { size: 'medium', emoji: '💫', points: 2, frequency: 500 },
    { size: 'large', emoji: '🌟', points: 3, frequency: 400 },
    { size: 'extra-large', emoji: '⭐', points: 5, frequency: 300 }
];

const popEmojis = ['💥', '✨', '🎉', '💫', '🌟', '⭐', '🎊'];

let audioContext;
let nextBubbleId = 1;

function initAudio() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio not supported');
        }
    }
}

function playPopSound(frequency) {
    if (!soundEnabled || !audioContext) return;

    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        console.log('Audio playback failed');
    }
}

function createBubble() {
    if (!gameActive) return;

    const gameArea = document.getElementById('gameArea');
    const bubble = document.createElement('div');
    const bubbleType = bubbleTypes[Math.floor(Math.random() * bubbleTypes.length)];
    const alphabetOptions = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    bubble.className = `bubble ${bubbleType.size}`;
    bubble.dataset.bubbleType = bubbleType.size;
    bubble.dataset.points = bubbleType.points;
    bubble.dataset.frequency = bubbleType.frequency;
    bubble.textContent = alphabetOptions[Math.floor(Math.random() * alphabetOptions.length)];

    bubble.id = `bubble-${nextBubbleId++}`;

    // Random position
    const maxX = gameArea.offsetWidth - 120;
    const maxY = gameArea.offsetHeight - 120;
    bubble.style.left = Math.max(0, Math.random() * maxX) + 'px';
    bubble.style.top = Math.max(0, Math.random() * maxY) + 'px';
    
    // Random animation delay
    bubble.style.animationDelay = Math.random() * 2 + 's';
    bubble.style.animationDuration = (3 + Math.random() * 2) + 's';

    // Add click/touch events
    bubble.addEventListener('click', () => popBubble(bubble));
    bubble.addEventListener('touchstart', (e) => {
        e.preventDefault();
        popBubble(bubble);
    });

    gameArea.appendChild(bubble);

    // Remove bubble after 6 seconds if not popped
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.remove();
        }
    }, 6000);
}

function popBubble(bubble) {
    if (!gameActive) return;

    initAudio();
    
    const points = parseInt(bubble.dataset.points);
    const frequency = parseInt(bubble.dataset.frequency);
    
    // Update score
    score += points;
    document.getElementById('scoreValue').textContent = score;
    
    // Update combo
    combo++;
    updateComboDisplay();
    
    // Reset combo timer
    if (comboTimer) clearTimeout(comboTimer);
    comboTimer = setTimeout(() => {
        combo = 0;
        updateComboDisplay();
    }, 2000);
    
    // Play pop sound
    playPopSound(frequency);
    
    // Create pop effect
    const popEffect = document.createElement('div');
    popEffect.className = 'pop-effect';
    popEffect.textContent = popEmojis[Math.floor(Math.random() * popEmojis.length)];
    popEffect.style.left = bubble.style.left;
    popEffect.style.top = bubble.style.top;
    
    document.getElementById('gameArea').appendChild(popEffect);
    
    // Create bubble trail effects
    createBubbleTrail(bubble);
    
    // Remove pop effect after animation
    setTimeout(() => {
        if (popEffect.parentNode) popEffect.remove();
    }, 800);
    
    // Show feedback for combos
    if (combo > 1 && combo % 5 === 0) {
        showFeedback(`🎉 ${combo} Combo! 🎉`, '#4169E1');
    } else if (combo === 10) {
        showFeedback('🌟 Amazing! 10 in a row! 🌟', '#FFD700');
    }
    
    // Remove bubble
    bubble.remove();
}

function createBubbleTrail(bubble) {
    const rect = bubble.getBoundingClientRect();
    const gameAreaRect = document.getElementById('gameArea').getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const trail = document.createElement('div');
            trail.className = 'bubble-trail';
            trail.style.left = (rect.left - gameAreaRect.left + Math.random() * 40 - 20) + 'px';
            trail.style.top = (rect.top - gameAreaRect.top + Math.random() * 40 - 20) + 'px';
            
            document.getElementById('gameArea').appendChild(trail);
            
            setTimeout(() => {
                if (trail.parentNode) trail.remove();
            }, 2000);
        }, i * 100);
    }
}

function updateComboDisplay() {
    let comboDisplay = document.querySelector('.combo-display');
    
    if (combo > 1) {
        if (!comboDisplay) {
            comboDisplay = document.createElement('div');
            comboDisplay.className = 'combo-display';
            document.getElementById('gameArea').appendChild(comboDisplay);
        }
        comboDisplay.textContent = `Combo: ${combo}x`;
        comboDisplay.style.display = 'block';
    } else if (comboDisplay) {
        comboDisplay.style.display = 'none';
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

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.querySelector('.sound-toggle');
    btn.textContent = soundEnabled ? '🔊' : '🔇';
    btn.title = soundEnabled ? 'Turn off sound' : 'Turn on sound';
}

function startNewGame() {
    score = 0;
    combo = 0;
    gameActive = true;
    document.getElementById('scoreValue').textContent = '0';
    
    // Clear game area
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';
    
    // Clear feedback
    const feedback = document.getElementById('feedback');
    feedback.textContent = '';
    feedback.classList.remove('show');
    
    // Clear intervals
    if (bubbleInterval) clearInterval(bubbleInterval);
    if (comboTimer) clearTimeout(comboTimer);
    
    // Start creating bubbles
    createBubble();
    createBubble();
    
    bubbleInterval = setInterval(() => {
        if (gameActive && Math.random() < 0.8) {
            createBubble();
        }
    }, 1500);
}

// Initialize game
window.addEventListener('load', startNewGame);
document.addEventListener('touchstart', () => initAudio(), { once: true });
document.addEventListener('click', () => initAudio(), { once: true });