console.log("JS is running");
const animals = [
    { 
        name: 'Cat', 
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' 
    },
    { 
        name: 'Dog', 
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' 
    },
    { 
        name: 'Elephant', 
        image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' 
    },
    { 
        name: 'Lion', 
        image: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' 
    },
    { 
        name: 'Tiger', 
        image: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg' // Tiger face close-up (Pexels)
    },
    { 
        name: 'Zebra', 
        image: '/images/image.png' // Zebra face close-up (Pexels)
    },
    { 
        name: 'Giraffe', 
        image: 'https://cdn.pixabay.com/photo/2017/04/11/21/34/giraffe-2222908_1280.jpg' // Giraffe head and neck from Pixabay
    },
    { 
        name: 'Monkey', 
        image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' 
    },
    { 
        name: 'Bear', 
        image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' 
    },
    { 
        name: 'Panda', 
        image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' 
    },
    { 
        name: 'Fox', 
        image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' 
    },
    { 
        name: 'Rabbit', 
        image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' 
    }
];
  const animalGrid = document.getElementById('animal-grid');
  const instruction = document.getElementById('instruction');
  const emojiFeedback = document.getElementById('emoji-feedback');
  
  let correctAnimal = null;
  let isGameActive = false;
  let questionCount = 0;
  const totalQuestions = 5; // easier for little kids
  
  function createGrid() {
    animalGrid.innerHTML = '';
    animals.forEach((animal) => {
      const card = document.createElement('div');
      card.className = 'animal-card';
      card.dataset.animalName = animal.name;
      card.innerHTML = `<img src="${animal.image}" alt="${animal.name}" draggable="false" />`;
      card.addEventListener('click', () => handleSelection(animal.name, card));
      animalGrid.appendChild(card);
    });
  }
  
  function speak(text, repeat = 1, delay = 700) {
    return new Promise((resolve) => {
      let count = 0;
      function speakOnce() {
        if (count < repeat) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'en-US';
          utterance.onend = () => {
            count++;
            setTimeout(speakOnce, delay);
          };
          speechSynthesis.speak(utterance);
        } else {
          resolve();
        }
      }
      speakOnce();
    });
  }
  
  async function startGame() {
    if (isGameActive) return;
    isGameActive = true;
    questionCount = 0;
    emojiFeedback.textContent = '';
    instruction.textContent = "Listen and pick the right animal!";
    await new Promise(r => setTimeout(r, 1000));
    await nextQuestion();
  }
  
  async function nextQuestion() {
    clearFeedback();
  
    if (questionCount >= totalQuestions) {
      instruction.textContent = "🎉 Hooray! You won! 🎉";
      await speak("Hooray! You won!");
      confettiFall();
      isGameActive = false;
      return;
    }
  
    questionCount++;
    correctAnimal = animals[Math.floor(Math.random() * animals.length)];
    instruction.textContent = `Find the ${correctAnimal.name}!`;
    await speak(correctAnimal.name, 3);
  }
  
  function showFeedback(emoji, card, correct) {
    emojiFeedback.textContent = emoji;
    if (card) {
      card.classList.add(correct ? 'correct' : 'wrong');
      setTimeout(() => {
        card.classList.remove(correct ? 'correct' : 'wrong');
      }, 800);
    }
  }
  
  function clearFeedback() {
    emojiFeedback.textContent = '';
    document.querySelectorAll('.animal-card').forEach(card => {
      card.classList.remove('correct', 'wrong');
    });
  }
  
  async function handleSelection(selectedName, card) {
    if (!isGameActive) return;
  
    if (selectedName === correctAnimal.name) {
      showFeedback('✅', card, true);
      await speak('You are right!');
      await new Promise(r => setTimeout(r, 500));
      await nextQuestion();
    } else {
      showFeedback('❌', card, false);
      await speak('Try again!');
    }
  }
  
  function confettiFall() {
    // Create multiple confetti pieces
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.backgroundColor = randomColor();
      confetti.style.animationDelay = (Math.random() * 3) + 's';
      confetti.style.width = confetti.style.height = (Math.random() * 8 + 5) + 'px';
      document.body.appendChild(confetti);
  
      // Remove confetti after animation
      confetti.addEventListener('animationend', () => {
        confetti.remove();
      });
    }
  }
  
  function randomColor() {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  createGrid();
  startGame();
  