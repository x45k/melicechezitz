const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let grassArray = [];
let balloon = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 80,
    width: 50,
    height: 50
};

let gameRunning = true;
let mouseX, mouseY;
let cameraOffsetY = 0;

const grassImage = new Image();
grassImage.src = './assets/grass-1.png';

const backgroundImage = new Image();
backgroundImage.src = './assets/background.png';

const balloonImage = new Image();
balloonImage.src = './assets/balloon.png';

const levels = [
    // level 1 with 1 obstacle
    [
        { type: 'grass', x: canvas.width / 2 - 25, y: -50, width: 50, height: 50 }
    ]
];

let currentLevelIndex = 0;

class Grass {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = Math.random() * 2 + 2;
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

    updatePosition(cursorX, cursorY) {
        const distance = 50;

        if (Math.abs(cursorX - this.x) < distance && Math.abs(cursorY - (this.y + cameraOffsetY)) < distance) {
            this.x = cursorX - this.width / 2;
        }
    }
}

function loadLevel() {
    grassArray = levels[currentLevelIndex].map(grass => new Grass(grass.x, grass.y));
}

function isCollision(grass) {
    return grass.y + cameraOffsetY + grass.height > balloon.y &&
           grass.x < balloon.x + balloon.width &&
           grass.x + grass.width > balloon.x;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    cameraOffsetY = Math.max(0, canvas.height - balloon.y - balloon.height);

    ctx.drawImage(balloonImage, balloon.x, balloon.y, balloon.width, balloon.height);

    grassArray.forEach((grass, index) => {
        grass.update();
        grass.updatePosition(mouseX, mouseY); 
        grass.draw(cameraOffsetY);

        if (isCollision(grass)) {
            gameRunning = false;
        }

        if (grass.isOffScreen()) {
            grassArray.splice(index, 1);
        }
    });

    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    } else {
        alert('Game Over!');
        balloon.y = canvas.height - 80;
        loadLevel();
        gameRunning = true;
        requestAnimationFrame(gameLoop);
    }
}

loadLevel();

canvas.addEventListener('mousemove', (event) => {
    mouseX = event.pageX;
    mouseY = event.pageY;
});

requestAnimationFrame(gameLoop);
