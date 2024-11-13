const dino = document.getElementById("dino");
const grass = document.getElementById("grass");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");

let score = 0;
let isJumping = false;
let isGameOver = false;
let gravity = 0.9;
let baseGrassSpeed = 10;
let playerSpeed = 1;
let gameTime = 0;
let highScore = localStorage.getItem("highScore") || 0;

highScoreDisplay.textContent = `High Score: ${highScore}`;

function resetGame() {
  score = 0;
  scoreDisplay.textContent = score;
  isGameOver = false;
  dino.style.top = "160px";
  grass.style.right = "-50px";
  gameTime = 0;
}

function jump() {
  if (isJumping) return;
  isJumping = true;
  let jumpVelocity = 15;
  let jumpInterval = setInterval(() => {
    if (jumpVelocity < 0 && dino.offsetTop >= 160) {
      clearInterval(jumpInterval);
      isJumping = false;
      dino.style.top = "160px";
    } else {
      dino.style.top = dino.offsetTop - jumpVelocity + "px";
      jumpVelocity -= gravity;
    }
  }, 20);
}

function moveGrass() {
  grass.style.right = "-50px";
  grass.classList.add("move-grass");

  let grassSpeed = baseGrassSpeed * playerSpeed;

  let moveInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(moveInterval);
      grass.classList.remove("move-grass");
      return;
    }

    gameTime++;
    if (gameTime % 100 === 0) {
      playerSpeed += 0.1;
    }

    if (gameTime % 50 === 0) { 
      baseGrassSpeed += 0.3;
    }

    if (parseInt(grass.style.right) > 800) {
      grass.style.right = "-50px";
      score++;
      scoreDisplay.textContent = score;
    } else {
      grass.style.right = parseInt(grass.style.right) + grassSpeed + "px";
    }
  }, 20);
}

function startGame() {
  resetGame();
  moveGrass();
  checkCollision();
}

function checkCollision() {
  if (isGameOver) return;
  const dinoRect = dino.getBoundingClientRect();
  const grassRect = grass.getBoundingClientRect();

  if (
    dinoRect.right > grassRect.left &&
    dinoRect.left < grassRect.right &&
    dinoRect.bottom > grassRect.top &&
    dinoRect.top < grassRect.bottom
  ) {
    isGameOver = true;
    
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
    
    alert(`Game Over! Your Score: ${score}\nHigh Score: ${highScore}`);
    highScoreDisplay.textContent = `High Score: ${highScore}`; 
    window.location.reload();
  } else {
    requestAnimationFrame(checkCollision);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

startGame();
