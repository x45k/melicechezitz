// global vars
let currentPage = 0;
const levelsPerPage = 5;
let currentLevel = 0;
const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
const playerHeight = 30;
const grassHeight = playerHeight - 10;
const levels = [
    // level 1 with 3 obstacles
    [
        { type: 'grass', x: 500, y: window.innerHeight - grassHeight, width: 20, height: grassHeight },
        { type: 'grass', x: 800, y: window.innerHeight - grassHeight, width: 20, height: grassHeight },
        { type: 'grass', x: 1300, y: window.innerHeight - grassHeight, width: 20, height: grassHeight },
    ],
    // level 2 with 3 obstacles
    [
        { type: 'grass', x: 500, y: window.innerHeight - grassHeight, width: 40, height: grassHeight },
        { type: 'grass', x: 800, y: window.innerHeight - grassHeight, width: 40, height: grassHeight },
        { type: 'grass', x: 1100, y: window.innerHeight - grassHeight, width: 40, height: grassHeight },
    ],
    // level 3 with 5 obstacles
    [
        { type: 'grass', x: 500, y: window.innerHeight - grassHeight, width: 40, height: grassHeight },
        { type: 'grass', x: 750, y: window.innerHeight - grassHeight, width: 35, height: (grassHeight + 5) },
        { type: 'grass', x: 1000, y: window.innerHeight - grassHeight, width: 45, height: grassHeight },
        { type: 'grass', x: 1200, y: window.innerHeight - grassHeight, width: 30, height: (grassHeight + 10) },
        { type: 'grass', x: 1300, y: window.innerHeight - grassHeight, width: 40, height: grassHeight },
    ],
    // level 4 with 3 wide obstacles
    [
        { type: 'grass', x: 500, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight - 5) },
        { type: 'grass', x: 1000, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight - 5) },
        { type: 'grass', x: 1500, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight - 5) },
    ],
    // level 5 with 3 tall obstacles
    [
        { type: 'grass', x: 400, y: window.innerHeight - grassHeight, width: 35, height: (grassHeight + 10) },
        { type: 'grass', x: 900, y: window.innerHeight - grassHeight, width: 35, height: (grassHeight + 10) },
        { type: 'grass', x: 1200, y: window.innerHeight - grassHeight, width: 40, height: (grassHeight + 10) },
    ],
    // level 6 with a mix of tall and short obstacles
    [
        { type: 'grass', x: 400, y: window.innerHeight - grassHeight, width: 35, height: (grassHeight + 10) },
        { type: 'grass', x: 700, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight - 5) },
        { type: 'grass', x: 1100, y: window.innerHeight - grassHeight, width: 35, height: (grassHeight + 10) },
        { type: 'grass', x: 1300, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight - 5)},
        { type: 'grass', x: 1800, y: window.innerHeight - grassHeight, width: 35, height: (grassHeight + 10)},
        { type: 'grass', x: 2200, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 10) },
    ],
    // level 7 with more obstacles and varying heights
    [
        { type: 'grass', x: 500, y: window.innerHeight - grassHeight, width: 60, height: (grassHeight - 10) },
        { type: 'grass', x: 800, y: window.innerHeight - grassHeight, width: 40, height: (grassHeight + 15) },
        { type: 'grass', x: 1100, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight - 5) },
        { type: 'grass', x: 1300, y: window.innerHeight - grassHeight, width: 70, height: (grassHeight + 20) },
        { type: 'grass', x: 1600, y: window.innerHeight - grassHeight, width: 40, height: (grassHeight - 15) },
    ],
    // level 8 with narrow gaps between tall obstacles
    [
        { type: 'grass', x: 400, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 20) },
        { type: 'grass', x: 600, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 30) },
        { type: 'grass', x: 800, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 20) },
        { type: 'grass', x: 1000, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 25) },
        { type: 'grass', x: 1200, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 15) },
    ],
    // level 9 with a series of staggered obstacles
    [
        { type: 'grass', x: 300, y: window.innerHeight - grassHeight, width: 40, height: (grassHeight + 10) },
        { type: 'grass', x: 600, y: window.innerHeight - grassHeight, width: 60, height: (grassHeight - 5) },
        { type: 'grass', x: 900, y: window.innerHeight - grassHeight, width: 40, height: (grassHeight + 10) },
        { type: 'grass', x: 1200, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 20) },
        { type: 'grass', x: 1500, y: window.innerHeight - grassHeight, width: 30, height: (grassHeight + 15) },
    ],
    // level 10 with increasing obstacle density
    [
        { type: 'grass', x: 200, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 25) },
        { type: 'grass', x: 400, y: window.innerHeight - grassHeight, width: 30, height: (grassHeight + 10) },
        { type: 'grass', x: 600, y: window.innerHeight - grassHeight, width: 40, height: (grassHeight + 15) },
        { type: 'grass', x: 800, y: window.innerHeight - grassHeight, width: 60, height: (grassHeight - 10) },
        { type: 'grass', x: 1000, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 30) },
        { type: 'grass', x: 1200, y: window.innerHeight - grassHeight, width: 70, height: (grassHeight - 5) },
        { type: 'grass', x: 1400, y: window.innerHeight - grassHeight, width: 40, height: (grassHeight + 10) },
    ],
    /* example block usage:
    [
        { type: 'block', x: 800, y: window.innerHeight - grassHeight, width: 60, height: 20 },
    ]
    make something with it ig if you want
    */
];

const totalPages = Math.ceil(levels.length / levelsPerPage); // this is here cause js was being stupid asf, couldnt access levels before initialization whatever

const player = {
    x: 50,
    y: window.innerHeight - playerHeight - 5,
    width: 30,
    height: playerHeight,
    velocityY: 0,
    gravity: 0.5,
    jumpPower: 10,
    jumpCount: 0,
    moveSpeed: 4,
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
    //is there a way easier way to do this? hell yes, but im not going to make my life easy

    document.body.innerHTML = '';

    document.body.style.backgroundImage = 'url(./assets/background.png)';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';

    const title = document.createElement('h1');
    title.textContent = 'Select Level';
    title.style.fontFamily = 'Fantasy, sans-serif';
    title.style.textAlign = 'center';
    title.style.marginTop = '50px';
    title.style.color = '#fff';
    title.style.textShadow = '2px 2px 10px rgba(0, 0, 0, 0.7)';
    document.body.appendChild(title);

    const levelsContainer = document.createElement('div');
    levelsContainer.style.display = 'flex';
    levelsContainer.style.justifyContent = 'center';
    levelsContainer.style.flexWrap = 'wrap';
    levelsContainer.style.marginTop = '20px';
    document.body.appendChild(levelsContainer);

    const startLevel = currentPage * levelsPerPage;
    const endLevel = Math.min(startLevel + levelsPerPage, levels.length);
    
    for (let i = startLevel; i < endLevel; i++) {
        const button = document.createElement('button');
        button.textContent = `Level ${i + 1}`;
        button.style.width = '150px';
        button.style.height = '60px';
        button.style.margin = '10px';
        button.style.borderRadius = '15px';
        button.style.fontSize = '18px';
        button.style.backgroundColor = '#007BFF';
        button.style.color = '#fff';
        button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        button.style.cursor = 'pointer';
        button.style.transition = 'transform 0.2s';

        button.onmouseover = () => {
            button.style.transform = 'scale(1.1)';
        };
        button.onmouseout = () => {
            button.style.transform = 'scale(1)';
        };

        if (i === 0 || completedLevels.includes(i - 1)) {
            button.onclick = () => navigateToLevel(i);
        } else {
            button.disabled = true;
            button.style.backgroundColor = '#555';
            button.style.cursor = 'not-allowed';
        }

        levelsContainer.appendChild(button);
    }

    const navContainer = document.createElement('div');
    navContainer.style.display = 'flex';
    navContainer.style.justifyContent = 'center';
    navContainer.style.marginTop = '30px';
    document.body.appendChild(navContainer);

    const prevButton = document.createElement('button');
    prevButton.textContent = '← Previous';
    prevButton.style.padding = '10px 20px';
    prevButton.style.marginRight = '20px';
    prevButton.style.fontSize = '18px';
    prevButton.style.cursor = 'pointer';
    prevButton.style.borderRadius = '10px';
    prevButton.style.backgroundColor = currentPage > 0 ? '#28A745' : '#888';
    prevButton.style.color = '#fff';
    prevButton.style.border = 'none';
    prevButton.onclick = () => {
        if (currentPage > 0) {
            currentPage--;
            showLevelMenu();
        }
    };

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next →';
    nextButton.style.padding = '10px 20px';
    nextButton.style.fontSize = '18px';
    nextButton.style.cursor = 'pointer';
    nextButton.style.borderRadius = '10px';
    nextButton.style.backgroundColor = currentPage < totalPages - 1 ? '#28A745' : '#888';
    nextButton.style.color = '#fff';
    nextButton.style.border = 'none';
    nextButton.onclick = () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            showLevelMenu();
        }
    };

    navContainer.appendChild(prevButton);
    navContainer.appendChild(nextButton);
}

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
        let obstacleElement;
        if (obstacle.type === 'grass') {
            obstacleElement = document.createElement('img');
            obstacleElement.src = './assets/grass-1.png';
        } else if (obstacle.type === 'block') {
            obstacleElement = document.createElement('img');
            obstacleElement.src = './assets/block.png';
        }
        obstacleElement.style.position = 'absolute';
        obstacleElement.style.left = `${obstacle.x}px`;
        obstacleElement.style.top = `${obstacle.y}px`;
        obstacleElement.style.width = `${obstacle.width}px`;
        obstacleElement.style.height = `${obstacle.height}px`;
        obstacleElement.setAttribute('data-cleared', 'false');
        gameContainer.appendChild(obstacleElement);
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
        if (e.code === 'Space' || e.code === 'KeyW') {
            e.preventDefault(); // your welcome human being, learn how js works <3
            jump();
        }
    });
    
    document.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            jump();
        }
    });    

    const gameInterval = setInterval(() => {
        updateGame(playerElement, gameContainer, gameInterval);
    }, 20);
}

function jump() {
    if (player.jumpCount < 1) { 
        player.velocityY = -player.jumpPower; 
        player.jumpCount++;
    }
}

function updateGame(playerElement, gameContainer, gameInterval) {
    player.velocityY += player.gravity; 
    player.y += player.velocityY;

    const obstacleElements = gameContainer.querySelectorAll('img[src="./assets/grass-1.png"], img[src="./assets/block.png"]');
    obstacleElements.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();
        const playerRect = {
            left: player.x,
            top: player.y,
            right: player.x + player.width,
            bottom: player.y + player.height,
        };

        if (
            playerRect.right > obstacleRect.left &&
            playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top &&
            playerRect.top < obstacleRect.bottom
        ) {
            if (obstacle.src.includes('block.png')) {
                // Player can stand on blocks
                if (player.velocityY > 0) {
                    player.y = obstacleRect.top - player.height;
                    player.velocityY = 0;
                    player.jumpCount = 0;
                }
            } else {
                clearInterval(gameInterval);
                showGameOverMessage();
            }
        }
    });

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

function moveObstacles(gameContainer) {
    const obstacleElements = gameContainer.querySelectorAll('img[src="./assets/grass-1.png"], img[src="./assets/block.png"]');
    obstacleElements.forEach(obstacle => {
        const currentX = parseFloat(obstacle.style.left);
        obstacle.style.left = `${currentX - player.moveSpeed}px`;

        if (currentX < -50) {
            obstacle.style.left = `${window.innerWidth + Math.random() * 200}px`;
        }
    });
}

function checkCollisions(gameInterval) {
    const obstacleElements = document.querySelectorAll('img[src="./assets/grass-1.png"], img[src="./assets/block.png"]');
    obstacleElements.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();
        const playerRect = {
            left: player.x,
            top: player.y,
            right: player.x + player.width,
            bottom: player.y + player.height,
        };

        if (
            playerRect.right > obstacleRect.left &&
            playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top &&
            playerRect.top < obstacleRect.bottom
        ) {
            if (obstacle.src.includes('block.png')) {
                // Player can walk on blocks without dying
                return;
            } else {
                clearInterval(gameInterval);
                showGameOverMessage();
            }
        } else {
            if (parseFloat(obstacle.style.left) + obstacleRect.width < playerRect.left) {
                obstacle.setAttribute('data-cleared', 'true');
            }
        }
    });

    const allCleared = Array.from(obstacleElements).every(obstacle => obstacle.getAttribute('data-cleared') === 'true');
    if (allCleared) {
        clearInterval(gameInterval);
        levelComplete();
    }
}

function showGameOverMessage() {
    const messageContainer = document.createElement('div');
    messageContainer.style.position = 'fixed';
    messageContainer.style.top = '50%';
    messageContainer.style.left = '50%';
    messageContainer.style.transform = 'translate(-50%, -50%)';
    messageContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    messageContainer.style.color = '#fff';
    messageContainer.style.padding = '20px';
    messageContainer.style.borderRadius = '10px';
    messageContainer.style.zIndex = '1000';
    messageContainer.style.textAlign = 'center'; // Center text
    messageContainer.innerHTML = `
        <h2>You touched the grass!</h2>
        <p>Game over!</p>
        <button id="dismiss-button" style="margin-top: 10px; padding: 10px 20px;">Dismiss</button>
        <button id="restart-button" style="margin-top: 10px; padding: 10px 20px;">Restart</button>
    `;
    document.body.appendChild(messageContainer);

    document.getElementById('dismiss-button').onclick = () => {
        document.body.removeChild(messageContainer);
        showLevelMenu();
    };

    document.getElementById('restart-button').onclick = () => {
        document.body.removeChild(messageContainer);
        navigateToLevel(currentLevel)
    };
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
    message.textContent = `Level ${currentLevel + 1} Complete`;
    overlay.appendChild(message);

    const quitButton = document.createElement('button');
    quitButton.textContent = 'Quit';
    quitButton.onclick = () => {
        if (!completedLevels.includes(currentLevel)) {
            completedLevels.push(currentLevel);
            localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
        }
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