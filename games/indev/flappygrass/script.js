const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');

let birdY = 200;
let birdVelocity = 0;
let gravity = 0.5;
let pipeSpeed = 2;
let isGameOver = false;
let score = 0;

// Bird movement
function gameLoop() {
    if (isGameOver) return;

    birdVelocity += gravity;
    birdY += birdVelocity;
    bird.style.top = birdY + 'px';

    if (birdY + bird.offsetHeight >= gameContainer.offsetHeight || birdY <= 0) {
        gameOver();
    }

    movePipes();
    requestAnimationFrame(gameLoop);
}

function jump() {
    if (isGameOver) return;
    birdVelocity = -8;
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') jump();
});

function createPipe() {
    const pipeHeight = Math.floor(Math.random() * 200) + 100;
    const pipeGap = 150;

    const topPipe = document.createElement('div');
    topPipe.classList.add('pipe', 'top');
    topPipe.style.height = pipeHeight + 'px';
    topPipe.style.top = '0px';
    topPipe.style.left = '100%';
    gameContainer.appendChild(topPipe);

    const bottomPipe = document.createElement('div');
    bottomPipe.classList.add('pipe', 'bottom');
    bottomPipe.style.height = (gameContainer.offsetHeight - pipeHeight - pipeGap) + 'px';
    bottomPipe.style.bottom = '0px';
    bottomPipe.style.left = '100%';
    gameContainer.appendChild(bottomPipe);

    topPipe.x = gameContainer.offsetWidth;
    bottomPipe.x = gameContainer.offsetWidth;

    function movePipe() {
        if (isGameOver) {
            topPipe.remove();
            bottomPipe.remove();
            return;
        }

        topPipe.x -= pipeSpeed;
        bottomPipe.x -= pipeSpeed;

        topPipe.style.left = topPipe.x + 'px';
        bottomPipe.style.left = bottomPipe.x + 'px';

        if (topPipe.x + topPipe.offsetWidth < 0) {
            topPipe.remove();
            bottomPipe.remove();
            score++;
            scoreDisplay.textContent = score;
        }

        if (checkCollision(bird, topPipe) || checkCollision(bird, bottomPipe)) {
            gameOver();
        }

        requestAnimationFrame(movePipe);
    }

    movePipe();
}

function checkCollision(bird, pipe) {
    const birdRect = bird.getBoundingClientRect();
    const pipeRect = pipe.getBoundingClientRect();

    return (
        birdRect.left < pipeRect.left + pipeRect.width &&
        birdRect.left + birdRect.width > pipeRect.left &&
        birdRect.top < pipeRect.top + pipeRect.height &&
        birdRect.height + birdRect.top > pipeRect.top
    );
}

function gameOver() {
    isGameOver = true;
    alert('Game Over! Score: ' + score);
    location.reload();
}

setInterval(createPipe, 2000);
gameLoop();
