// basic setup for three.js which makes my brain hurt very badly
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const groundGeometry = new THREE.PlaneGeometry(200, 200);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const playerTexture = new THREE.TextureLoader().load('./assets/player.png');
const playerGeometry = new THREE.BoxGeometry(1, 1, 1); // Keep the size constant
const playerMaterial = new THREE.MeshBasicMaterial({ map: playerTexture });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 1; 
scene.add(player);

let obstacles = [];
const obstacleMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./assets/grass-1.png') });

function createObstacle() {
    const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.x = Math.random() * 20 - 10;
    obstacle.position.y = 1; 
    obstacle.position.z = Math.random() * -100 - 5;
    obstacles.push(obstacle);
    scene.add(obstacle);
}

camera.position.set(0, 5, 10);

let gameOver = false;
player.isJumping = false;
player.velocityY = 0;

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !player.isJumping) {
        player.isJumping = true;
        player.velocityY = 5;
    }
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        player.position.x -= 0.5; 
    }
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        player.position.x += 0.5; 
    }
});

function animate() {
    if (gameOver) return;

    requestAnimationFrame(animate);

    player.position.z -= 0.1;
    camera.position.z -= 0.1;

    if (player.isJumping) {
        player.position.y += player.velocityY;
        player.velocityY -= 0.2;
        if (player.position.y <= 1) { 
            player.position.y = 1;
            player.isJumping = false;
        }
    }

    if (Math.random() < 0.02) {
        createObstacle();
    }

    obstacles.forEach((obstacle) => {
        obstacle.position.z += 0.1;
        if (obstacle.position.z > 5) {
            scene.remove(obstacle);
            obstacles.splice(obstacles.indexOf(obstacle), 1);
        }
    });

    obstacles.forEach((obstacle) => {
        if (player.position.distanceTo(obstacle.position) < 1) {
            alert('Game Over!'); 
            gameOver = true;
        }
    });

    renderer.render(scene, camera);
}

animate();