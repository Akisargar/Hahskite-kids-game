// Your full code here...

console.log("JS is running");
const games = {
    'balloon-pop': {
        title: 'Pop the Balloons',
        file: 'games/balloon-pop/index.html'
    },
    'animal-sounds': {
        title: 'Animal Sounds',
        file: 'games/animal-sounds/index.html'
    },
    'color-match': {
        title: 'Color Match',
        file: 'games/color-match/index.html'
    },
    'shape-sorter': {
        title: 'Shape Sorter',
        file: 'games/shape-sorter/index.html'
    },
    'bubble-tap': {
        title: 'Bubble Tap',
        file: 'games/bubble-tap/index.html'
    }, 
    'fill-basket': {
        title: 'Fill the Basket',
        file: 'games/fill-basket/index.html'
    }
};

function launchGame(gameId) {
    const game = games[gameId];
    if (game) {
        const modal = document.getElementById('gameModal');
        const gameFrame = document.getElementById('gameFrame');
        
        gameFrame.src = game.file;
        modal.style.display = 'block';
        
        playClickSound();
        addSparkles();
    }
}

function closeGame() {
    const modal = document.getElementById('gameModal');
    const gameFrame = document.getElementById('gameFrame');
    
    modal.style.display = 'none';
    gameFrame.src = '';
}

window.onclick = function(event) {
    const modal = document.getElementById('gameModal');
    if (event.target === modal) {
        closeGame();
    }
}

function addSparkles() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createSparkle();
        }, i * 100);
    }
}

function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.top = Math.random() * window.innerHeight + 'px';
    sparkle.style.fontSize = '2rem';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.animation = 'sparkleFloat 2s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.remove();
        }
    }, 2000);
}

const sparkleCSS = `
@keyframes sparkleFloat {
    0% {
        transform: translateY(0) scale(0);
        opacity: 1;
    }
    50% {
        transform: translateY(-50px) scale(1);
        opacity: 1;
    }
    100% {
        transform: translateY(-100px) scale(0);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = sparkleCSS;
document.head.appendChild(style);

function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log('Audio not supported');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.game-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeGame();
    }
});

// **Make these functions available globally for inline onclick handlers**
window.launchGame = launchGame;
window.closeGame = closeGame;
