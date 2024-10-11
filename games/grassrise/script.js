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
    heightTraveled: 0
};

let gameRunning = true;
let gamePaused = false;
let mouseX, mouseY;
let cameraOffsetY = 0;
let heightMarkers = [100, 500, 1000];

const grassImage = new Image();
grassImage.src = './assets/grass-1.png';

const backgroundImage = new Image();
backgroundImage.src = './assets/background.png';

const balloonImage = new Image();
balloonImage.src = './assets/balloon.png';

const pauseIcon = new Image();
pauseIcon.src = './assets/pause-icon.png';

const buttonSize = 50;

const levels = [
    [
        { type: 'grass', x: canvas.width / 2 - 25, y: -50, width: 50, height: 50 }
    ]
];

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
        this.originalX = x;
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
        this.x = this.originalX;
        this.y = this.originalY;
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

    loadLevel();

    requestAnimationFrame(gameLoop);
}

function drawPauseButton() {
    ctx.drawImage(pauseIcon, canvas.width - buttonSize - 20, 20, buttonSize, buttonSize);
}

function checkPauseButtonClick(x, y) {
    const buttonX = canvas.width - buttonSize - 20;
    const buttonY = 20;

    if (x >= buttonX && x <= buttonX + buttonSize && y >= buttonY && y <= buttonY + buttonSize) {
        gamePaused = !gamePaused;
        if (!gamePaused) {
            requestAnimationFrame(gameLoop);
        }
    }
}

function gameLoop() {
    if (gamePaused) return; 

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    cameraOffsetY = Math.max(0, canvas.height - balloon.y - balloon.height);

    balloon.heightTraveled += grassArray[0].speed; 

    displayHeightMarkers();

    ctx.drawImage(balloonImage, balloon.x, balloon.y, balloon.width, balloon.height);

    grassArray.forEach((grass, index) => {
        grass.update();
        grass.updatePosition(mouseX, mouseY);
        grass.draw(cameraOffsetY);

        if (isCollision(grass)) {
            gameRunning = false;
        }

        if (grass.isOffScreen()) {
            grass.resetToOriginalPosition();
        }
    });

    drawPauseButton();

    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    } else {
        displayGameOver();
    }
}

canvas.addEventListener('mousemove', (event) => {
    mouseX = event.pageX;
    mouseY = event.pageY;
});

canvas.addEventListener('click', (event) => {
    checkPauseButtonClick(event.pageX, event.pageY);
});

loadLevel();
requestAnimationFrame(gameLoop);
