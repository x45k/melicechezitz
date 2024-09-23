// Global variables
let currentLevel = 0;
const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
const playerHeight = 30;
const grassHeight = playerHeight - 10;
const levels = [
    // Level 1 with 3 obstacles
    [
        { type: 'grass', x: 500, y: window.innerHeight - grassHeight, width: 50, height: grassHeight },
        { type: 'grass', x: 900, y: window.innerHeight - grassHeight, width: 50, height: grassHeight },
        { type: 'grass', x: 1300, y: window.innerHeight - grassHeight, width: 50, height: grassHeight },
    ],
    // Level 2 with 3 obstacles
    [
        { type: 'grass', x: 100, y: window.innerHeight - grassHeight, width: 50, height: grassHeight },
        { type: 'grass', x: 300, y: window.innerHeight - (grassHeight + 50), width: 50, height: grassHeight },
        { type: 'grass', x: 500, y: window.innerHeight - (grassHeight + 100), width: 50, height: grassHeight },
    ],
];

const player = {
    x: 50,
    y: window.innerHeight - playerHeight - 5,
    width: 30,
    height: playerHeight,
    velocityY: 0,
    gravity: 0.5,
    jumpPower: 10,
    jumpCount: 0,
    moveSpeed: 2,
};

function initGame() {
    showLevelMenu();
}

function navigateToLevel(level) {
    currentLevel = level;
    localStorage.setItem('currentLevel', currentLevel);
    startLevel(currentLevel);
}

function showLevelMenu() {
    document.body.innerHTML = '';
    const title = document.createElement('h1');
    title.textContent = 'Select Level';
    document.body.appendChild(title);

    for (let i = 0; i < levels.length; i++) {
        const button = document.createElement('button');
        button.textContent = `Level ${i + 1}`;
        button.style.width = '200px';
        button.onclick = () => navigateToLevel(i);

        if (completedLevels.includes(i) || i === 0) {
            document.body.appendChild(button);
        } else {
            button.disabled = true;
            button.style.cursor = 'not-allowed';
        }
    }
}

// Start the selected level
function startLevel(level) {
    document.body.innerHTML = '';

    const gameContainer = document.createElement('div');
    gameContainer.style.position = 'relative';
    gameContainer.style.overflow = 'hidden';
    gameContainer.style.width = '100vw';
    gameContainer.style.height = '100vh';
    document.body.appendChild(gameContainer);

    const background = document.createElement('img');
    background.src = './assets/background.png';
    background.style.position = 'absolute';
    background.style.width = '100%';
    background.style.height = '100%';
    background.style.objectFit = 'cover';
    background.style.zIndex = '-1';
    gameContainer.appendChild(background);

    levels[level].forEach(obstacle => {
        const grass = document.createElement('img');
        grass.src = './assets/grass-1.png';
        grass.style.position = 'absolute';
        grass.style.left = `${obstacle.x}px`;
        grass.style.top = `${obstacle.y}px`;
        grass.style.width = `${obstacle.width}px`;
        grass.style.height = `${obstacle.height}px`;
        grass.setAttribute('data-cleared', 'false');
        gameContainer.appendChild(grass);
    });

    initPlayer(gameContainer);
}

function initPlayer(gameContainer) {
    resetPlayer();
    const playerElement = document.createElement('img');
    playerElement.src = './assets/player.png';
    playerElement.style.position = 'absolute';
    playerElement.style.left = `${player.x}px`;
    playerElement.style.top = `${player.y}px`;
    playerElement.style.width = `${player.width}px`;
    playerElement.style.height = `${player.height}px`;
    gameContainer.appendChild(playerElement);

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            jump();
        }
    });

    const gameInterval = setInterval(() => {
        updateGame(playerElement, gameContainer, gameInterval);
    }, 20);
}

function jump() {
    if (player.jumpCount < 2) { 
        player.velocityY = -player.jumpPower; 
        player.jumpCount++;
    }
}

function updateGame(playerElement, gameContainer, gameInterval) {
    player.velocityY += player.gravity; 
    player.y += player.velocityY;

    if (player.y > window.innerHeight - playerHeight - 5) {
        player.y = window.innerHeight - playerHeight - 5; 
        player.jumpCount = 0; 
        player.velocityY = 0; 
    }

    playerElement.style.left = `${player.x}px`;
    playerElement.style.top = `${player.y}px`;

    moveObstacles(gameContainer);

    checkCollisions(gameInterval);
}

// Move obstacles to simulate player movement
function moveObstacles(gameContainer) {
    const grassElements = gameContainer.querySelectorAll('img[src="./assets/grass-1.png"]'); 
    grassElements.forEach(grass => {
        const currentX = parseFloat(grass.style.left);
        grass.style.left = `${currentX - player.moveSpeed}px`;

        if (currentX < -50) {
            grass.style.left = `${window.innerWidth + Math.random() * 200}px`;
        }
    });
}

function checkCollisions(gameInterval) {
    const grassElements = document.querySelectorAll('img[src="./assets/grass-1.png"]'); 
    grassElements.forEach(grass => {
        const grassRect = grass.getBoundingClientRect();
        const playerRect = {
            left: player.x,
            top: player.y,
            right: player.x + player.width,
            bottom: player.y + player.height,
        };

        if (
            playerRect.right > grassRect.left &&
            playerRect.left < grassRect.right &&
            playerRect.bottom > grassRect.top &&
            playerRect.top < grassRect.bottom
        ) {
            alert('You touched the grass! Game Over.');
            clearInterval(gameInterval);
            resetPlayer();
            player.jumpCount = 0;
            return;
        } else {
            if (parseFloat(grass.style.left) + grassRect.width < playerRect.left) {
                grass.setAttribute('data-cleared', 'true');
            }
        }
    });

    const allCleared = Array.from(grassElements).every(grass => grass.getAttribute('data-cleared') === 'true');
    if (allCleared) {
        clearInterval(gameInterval);
        levelComplete();
    }
}

function levelComplete() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    document.body.appendChild(overlay);

    const message = document.createElement('h2');
    message.textContent = 'Level Complete!';
    overlay.appendChild(message);

    const quitButton = document.createElement('button');
    quitButton.textContent = 'Quit';
    quitButton.onclick = () => {
        document.body.removeChild(overlay);
        showLevelMenu();
    };
    overlay.appendChild(quitButton);

    const continueButton = document.createElement('button');
    continueButton.textContent = 'Continue';
    continueButton.onclick = () => {
        if (!completedLevels.includes(currentLevel)) {
            completedLevels.push(currentLevel);
            localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
        }
        document.body.removeChild(overlay);
        navigateToLevel(currentLevel + 1);
    };
    overlay.appendChild(continueButton);
}

function resetPlayer() {
    player.x = 50;
    player.y = window.innerHeight - playerHeight - 5;
    player.velocityY = 0;
    player.jumpCount = 0;
}

window.onload = initGame;