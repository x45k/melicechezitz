const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let grassArray = [];
let balloon = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 80,
    width: 50,
    height: 50,
    heightTraveled: 0 // Tracks how far the balloon has traveled
};

let gameRunning = true;
let gamePaused = false; // Variable to track game pause state
let mouseX, mouseY;
let cameraOffsetY = 0;
let heightMarkers = [100, 500, 1000]; // Add more markers as needed

const grassImage = new Image();
grassImage.src = './assets/grass-1.png';

const backgroundImage = new Image();
backgroundImage.src = './assets/background.png';

const balloonImage = new Image();
balloonImage.src = './assets/balloon.png';

// Pause button icon
const pauseIcon = new Image();
pauseIcon.src = './assets/pause-icon.png'; // Add your pause icon path here

const buttonSize = 50; // Size of the pause button

// Define the levels with specific grass positions
const levels = [
    [
        { type: 'grass', x: canvas.width / 2 - 25, y: -50, width: 50, height: 50 }
    ]
];

// Load the grass objects from the levels
function loadLevel() {
    grassArray = levels[0].map(grassData => new Grass(grassData.x, grassData.y, grassData.width, grassData.height));
}

class Grass {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 2;
        this.originalX = x; // Store the original X and Y for resetting
        this.originalY = y;
    }

    draw(offsetY) {
        ctx.drawImage(grassImage, this.x, this.y + offsetY, this.width, this.height);
    }

    update() {
        this.y += this.speed;
    }

    isOffScreen() {
        return this.y > canvas.height + cameraOffsetY;
    }

    resetToOriginalPosition() {
        this.x = this.originalX; // Reset to original X
        this.y = this.originalY; // Reset to original Y
    }

    updatePosition(cursorX, cursorY) {
        const distance = 50;

        if (Math.abs(cursorX - this.x) < distance && Math.abs(cursorY - (this.y + cameraOffsetY)) < distance) {
            this.x = cursorX - this.width / 2;
        }
    }
}

function displayHeightMarkers() {
    ctx.fillStyle = 'black';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'left';

    heightMarkers.forEach((marker) => {
        if (balloon.heightTraveled >= marker - canvas.height / 2 && balloon.heightTraveled <= marker + canvas.height) {
            ctx.fillText(`${marker}m`, 10, canvas.height - (marker - balloon.heightTraveled));
        }
    });
}

function isCollision(grass) {
    return grass.y + cameraOffsetY + grass.height > balloon.y &&
        grass.x < balloon.x + balloon.width &&
        grass.x + grass.width > balloon.x;
}

function displayGameOver() {
    const distanceTraveled = Math.floor(balloon.heightTraveled);
    const retry = confirm(`Game Over! You reached ${distanceTraveled} meters. Do you want to retry?`);
    if (retry) {
        restartGame();
    }
}

function restartGame() {
    balloon.y = canvas.height - 80;
    balloon.heightTraveled = 0;
    gameRunning = true;

    // Reload the level to reset the grass positions
    loadLevel();

    requestAnimationFrame(gameLoop);
}

// Draws the pause button in the top-right corner
function drawPauseButton() {
    ctx.drawImage(pauseIcon, canvas.width - buttonSize - 20, 20, buttonSize, buttonSize);
}

// Check if the pause button is clicked
function checkPauseButtonClick(x, y) {
    const buttonX = canvas.width - buttonSize - 20;
    const buttonY = 20;

    if (x >= buttonX && x <= buttonX + buttonSize && y >= buttonY && y <= buttonY + buttonSize) {
        gamePaused = !gamePaused; // Toggle pause state
        if (!gamePaused) {
            requestAnimationFrame(gameLoop); // Resume the game loop when unpaused
        }
    }
}

function gameLoop() {
    if (gamePaused) return; // If the game is paused, stop the loop

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    cameraOffsetY = Math.max(0, canvas.height - balloon.y - balloon.height);

    balloon.heightTraveled += grassArray[0].speed; // Increment the traveled height

    // Display height markers on the side
    displayHeightMarkers();

    ctx.drawImage(balloonImage, balloon.x, balloon.y, balloon.width, balloon.height);

    grassArray.forEach((grass, index) => {
        grass.update();
        grass.updatePosition(mouseX, mouseY); // Re-enable grass movement by cursor
        grass.draw(cameraOffsetY);

        if (isCollision(grass)) {
            gameRunning = false;
        }

        if (grass.isOffScreen()) {
            grass.resetToOriginalPosition(); // Reset grass to its original position from the levels array
        }
    });

    // Draw the pause button
    drawPauseButton();

    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    } else {
        displayGameOver();
    }
}

// Event listener for mouse movement
canvas.addEventListener('mousemove', (event) => {
    mouseX = event.pageX;
    mouseY = event.pageY;
});

// Event listener for mouse clicks to detect pause button clicks
canvas.addEventListener('click', (event) => {
    checkPauseButtonClick(event.pageX, event.pageY);
});

// Load level and start the game loop
loadLevel();
requestAnimationFrame(gameLoop);
