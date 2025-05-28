console.log("JS is running");
let score = 0;
let soundEnabled = true;
let draggedShape = null;

const shapes = [
    { type: 'circle', emoji: '🔴', color: '#FF6B6B' },
    { type: 'square', emoji: '🟦', color: '#4ECDC4' },
    { type: 'triangle', emoji: '🔺', color: '#FFEAA7' },
    { type: 'star', emoji: '⭐', color: '#DDA0DD' }
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

function playSound(frequency, duration = 0.3) {
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

function createShapes() {
    const shapesArea = document.getElementById('shapesArea');
    shapesArea.innerHTML = '';
    
    // Create 2 of each shape type, shuffled
    const allShapes = [...shapes, ...shapes].sort(() => Math.random() - 0.5);
    
    allShapes.forEach((shapeData, index) => {
        const shape = document.createElement('div');
        shape.className = `shape ${shapeData.type}`;
        shape.draggable = true;
        shape.dataset.shapeType = shapeData.type;
        shape.textContent = shapeData.emoji;
        shape.style.animationDelay = (index * 0.1) + 's';
        
        // Add drag event listeners
        shape.addEventListener('dragstart', handleDragStart);
        shape.addEventListener('dragend', handleDragEnd);
        
        // Touch events for mobile
        shape.addEventListener('touchstart', handleTouchStart);
        shape.addEventListener('touchmove', handleTouchMove);
        shape.addEventListener('touchend', handleTouchEnd);
        
        shapesArea.appendChild(shape);
    });
}

function setupDropZones() {
    const holes = document.querySelectorAll('.hole');
    
    holes.forEach(hole => {
        hole.addEventListener('dragover', handleDragOver);
        hole.addEventListener('drop', handleDrop);
        hole.addEventListener('dragenter', handleDragEnter);
        hole.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    draggedShape = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedShape = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    if (draggedShape) {
        const shapeType = draggedShape.dataset.shapeType;
        const holeType = e.target.dataset.shape;
        
        if (shapeType === holeType) {
            // Correct match
            handleCorrectMatch(e.target, draggedShape);
        } else {
            // Wrong match
            handleWrongMatch();
        }
    }
}

// Touch events for mobile support
let touchShape = null;
let touchOffset = { x: 0, y: 0 };

function handleTouchStart(e) {
    e.preventDefault();
    touchShape = e.target;
    const touch = e.touches[0];
    const rect = touchShape.getBoundingClientRect();
    touchOffset.x = touch.clientX - rect.left;
    touchOffset.y = touch.clientY - rect.top;
    touchShape.classList.add('dragging');
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!touchShape) return;
    
    const touch = e.touches[0];
    touchShape.style.position = 'fixed';
    touchShape.style.left = (touch.clientX - touchOffset.x) + 'px';
    touchShape.style.top = (touch.clientY - touchOffset.y) + 'px';
    touchShape.style.zIndex = '1000';
}

function handleTouchEnd(e) {
    e.preventDefault();
    if (!touchShape) return;
    
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const hole = elementBelow?.closest('.hole');
    
    if (hole) {
        const shapeType = touchShape.dataset.shapeType;
        const holeType = hole.dataset.shape;
        
        if (shapeType === holeType) {
            handleCorrectMatch(hole, touchShape);
        } else {
            handleWrongMatch();
            resetTouchShape();
        }
    } else {
        resetTouchShape();
    }
    
    touchShape.classList.remove('dragging');
    touchShape = null;
}

function resetTouchShape() {
    if (touchShape) {
        touchShape.style.position = '';
        touchShape.style.left = '';
        touchShape.style.top = '';
        touchShape.style.zIndex = '';
    }
}

function handleCorrectMatch(hole, shape) {
    initAudio();
    
    // Visual feedback
    hole.classList.add('correct-drop');
    
    // Remove shape from play area
    shape.remove();
    
    // Update score
    score++;
    document.getElementById('scoreValue').textContent = score;
    
    // Play success sound
    playSound(523, 0.4);
    
    // Show feedback
    showFeedback('🎉 Perfect match! 🎉', '#4ECDC4');
    
    // Check if all shapes are sorted
    const remainingShapes = document.querySelectorAll('.shape');
    if (remainingShapes.length === 0) {
        setTimeout(() => {
            showCelebration();
        }, 1000);
    }
    
    // Remove visual feedback
    setTimeout(() => {
        hole.classList.remove('correct-drop');
    }, 600);
}

function handleWrongMatch() {
    initAudio();
    playSound(200, 0.3);
    showFeedback('Try a different hole! 😊', '#FF6B6B');
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

function showCelebration() {
    const celebration = document.createElement('div');
    celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4em;
        z-index: 1000;
        animation: celebrate 2s ease-out forwards;
        pointer-events: none;
        color: #4ECDC4;
        font-weight: bold;
    `;
    celebration.textContent = '🌟 All shapes sorted! Amazing! 🌟';
    document.body.appendChild(celebration);
    
    // Add celebration CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes celebrate {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        if (celebration.parentNode) celebration.remove();
        if (style.parentNode) style.remove();
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
    document.getElementById('scoreValue').textContent = '0';
    
    // Clear feedback
    const feedback = document.getElementById('feedback');
    feedback.textContent = '';
    feedback.classList.remove('show');
    
    // Remove any visual effects from holes
    document.querySelectorAll('.hole').forEach(hole => {
        hole.classList.remove('correct-drop', 'drag-over');
    });
    
    createShapes();
}

// Initialize game
window.addEventListener('load', () => {
    setupDropZones();
    startNewGame();
});

document.addEventListener('touchstart', () => initAudio(), { once: true });
document.addEventListener('click', () => initAudio(), { once: true });