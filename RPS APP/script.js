// DOM Elements
const choices = document.querySelectorAll('.choice');
const resultDisplay = document.getElementById('result');
const playerScoreDisplay = document.getElementById('player-score');
const computerScoreDisplay = document.getElementById('computer-score');
const resetButton = document.getElementById('reset');
const countdownDisplay = document.getElementById('countdown');
const handsDisplay = document.getElementById('hands');
const playerHandDisplay = document.getElementById('player-hand');
const computerHandDisplay = document.getElementById('computer-hand');
const vsDisplay = document.getElementById('vs');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');

// Game State
let playerScore = 0;
let computerScore = 0;
let isAnimating = false;
let difficulty = 'easy';
let playerHistory = [];

// Initial Setup
handsDisplay.style.opacity = '0';
vsDisplay.style.opacity = '1';
countdownDisplay.style.opacity = '0';

// Sound Effects (placeholder)
const playSound = (type) => {
    // In a real implementation, you would use actual sound files
    console.log(`Playing ${type} sound`);
};

// Computer AI based on difficulty
function getComputerChoice(playerChoice) {
    playSound('beep');
    
    if (difficulty === 'easy') {
        // Easy: completely random choices
        return ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
    } else if (difficulty === 'medium') {
        // Medium: sometimes counters player's common moves
        if (playerHistory.length > 3 && Math.random() < 0.6) {
            const lastThree = playerHistory.slice(-3);
            const counts = {
                rock: lastThree.filter(c => c === 'rock').length,
                paper: lastThree.filter(c => c === 'paper').length,
                scissors: lastThree.filter(c => c === 'scissors').length
            };
            
            const mostCommon = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
            
            if (mostCommon === 'rock') return 'paper';
            if (mostCommon === 'paper') return 'scissors';
            if (mostCommon === 'scissors') return 'rock';
        }
        return ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
    } else {
        // Hard: tries to counter player's current choice with high probability
        if (Math.random() < 0.7) {
            if (playerChoice === 'rock') return 'paper';
            if (playerChoice === 'paper') return 'scissors';
            if (playerChoice === 'scissors') return 'rock';
        }
        return ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
    }
}

// Game Logic
function playGame(playerChoice) {
    if (isAnimating) return;
    isAnimating = true;
    playSound('select');
    
    // Record player choice for medium difficulty pattern detection
    playerHistory.push(playerChoice);
    if (playerHistory.length > 10) playerHistory.shift();
    
    // Disable buttons during animation
    choices.forEach(choice => {
        choice.classList.add('disabled');
    });
    
    // Hide hands and VS, show countdown
    handsDisplay.style.opacity = '0';
    vsDisplay.style.opacity = '0';
    countdownDisplay.style.opacity = '1';
    
    // Countdown animation
    let count = 3;
    countdownDisplay.textContent = count;
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownDisplay.textContent = count;
            playSound('countdown');
            countdownDisplay.classList.add('bouncing');
            setTimeout(() => countdownDisplay.classList.remove('bouncing'), 400);
        } else {
            clearInterval(countdownInterval);
            countdownDisplay.textContent = 'GO!';
            playSound('shoot');
            countdownDisplay.classList.add('shoot');
            
            setTimeout(() => {
                countdownDisplay.style.opacity = '0';
                countdownDisplay.classList.remove('shoot');
                
                // Generate computer choice based on difficulty
                const computerChoice = getComputerChoice(playerChoice);
                
                // Set player choice display
                playerHandDisplay.textContent = playerChoice === 'rock' ? '✊' : 
                                            playerChoice === 'paper' ? '✋' : '✌️';
                
                // Set computer choice display
                computerHandDisplay.textContent = computerChoice === 'rock' ? '✊' : 
                                                computerChoice === 'paper' ? '✋' : '✌️';
                
                // Reveal hands
                handsDisplay.style.opacity = '1';
                
                // Calculate result
                let result = '';
                let resultClass = '';
                
                if (playerChoice === computerChoice) {
                    result = "TIE GAME!";
                    resultClass = 'tie';
                    playSound('tie');
                } else {
                    switch(playerChoice) {
                        case 'rock':
                            if (computerChoice === 'scissors') {
                                result = 'PLAYER WINS! ROCK SMASHES SCISSORS!';
                                resultClass = 'win-message';
                                playerHandDisplay.classList.add('win');
                                playSound('win');
                            } else {
                                result = 'CPU WINS! PAPER COVERS ROCK!';
                                resultClass = 'lose-message';
                                computerHandDisplay.classList.add('win');
                                playSound('lose');
                            }
                            break;
                        case 'paper':
                            if (computerChoice === 'rock') {
                                result = 'PLAYER WINS! PAPER COVERS ROCK!';
                                resultClass = 'win-message';
                                playerHandDisplay.classList.add('win');
                                playSound('win');
                            } else {
                                result = 'CPU WINS! SCISSORS CUT PAPER!';
                                resultClass = 'lose-message';
                                computerHandDisplay.classList.add('win');
                                playSound('lose');
                            }
                            break;
                        case 'scissors':
                            if (computerChoice === 'paper') {
                                result = 'PLAYER WINS! SCISSORS CUT PAPER!';
                                resultClass = 'win-message';
                                playerHandDisplay.classList.add('win');
                                playSound('win');
                            } else {
                                result = 'CPU WINS! ROCK SMASHES SCISSORS!';
                                resultClass = 'lose-message';
                                computerHandDisplay.classList.add('win');
                                playSound('lose');
                            }
                            break;
                    }
                }
                
                // Update scores
                if (result.includes('PLAYER WINS')) playerScore++;
                if (result.includes('CPU WINS')) computerScore++;
                
                // Display results
                resultDisplay.textContent = result;
                resultDisplay.className = '';
                resultDisplay.classList.add(resultClass);
                playerScoreDisplay.textContent = playerScore;
                computerScoreDisplay.textContent = computerScore;
                
                // Re-enable buttons
                setTimeout(() => {
                    choices.forEach(choice => {
                        choice.classList.remove('disabled');
                    });
                    
                    playerHandDisplay.classList.remove('win');
                    computerHandDisplay.classList.remove('win');
                    isAnimating = false;
                }, 1000);
            }, 500);
        }
    }, 800);
}

// Event Listeners
choices.forEach(choice => {
    choice.addEventListener('click', () => {
        const playerChoice = choice.getAttribute('data-choice');
        playGame(playerChoice);
    });
    
    choice.addEventListener('mouseenter', () => {
        if (!choice.classList.contains('disabled')) {
            playSound('hover');
        }
    });
});

// Difficulty selection
difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        difficultyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        difficulty = btn.getAttribute('data-difficulty');
        playerHistory = [];
        playSound('select');
        
        resultDisplay.textContent = `DIFFICULTY: ${difficulty.toUpperCase()}`;
        resultDisplay.className = '';
        setTimeout(() => {
            if (resultDisplay.textContent.includes('DIFFICULTY')) {
                resultDisplay.textContent = 'CHOOSE YOUR WEAPON!';
            }
        }, 2000);
    });
});

// Reset button
resetButton.addEventListener('click', () => {
    playerScore = 0;
    computerScore = 0;
    playerScoreDisplay.textContent = '0';
    computerScoreDisplay.textContent = '0';
    resultDisplay.textContent = 'CHOOSE YOUR WEAPON!';
    resultDisplay.className = '';
    handsDisplay.style.opacity = '0';
    vsDisplay.style.opacity = '1';
    countdownDisplay.style.opacity = '0';
    playerHistory = [];
    playSound('reset');
});