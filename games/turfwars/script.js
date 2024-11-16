let bullets = [];
let keys = { w: false, a: false, s: false, d: false };
let enemies = [];
let moveSpeed = 0.1;
let playerHealth = 100;
let maxPlayerHealth = 100;
let healthRegenRate = 0.01;

let yaw = 0;
let pitch = 0;
const sensitivity = 0.002;
const maxPitch = Math.PI / 2 - 0.1;
const minPitch = -Math.PI / 2 + 0.1;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("gameContainer").appendChild(renderer.domElement);

  document.body.addEventListener("click", () => {
    document.body.requestPointerLock();
  });

  document.addEventListener("mousemove", (e) => {
    if (document.pointerLockElement === document.body) {
      yaw -= e.movementX * sensitivity;
      pitch -= e.movementY * sensitivity;

      pitch = Math.max(minPitch, Math.min(maxPitch, pitch));

      camera.rotation.y = yaw;
      camera.rotation.x = pitch;
    }
  });

  document.addEventListener("mousedown", (e) => {
    if (e.button === 0) shoot();
  });

  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x404040 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  spawnEnemy();
  setInterval(spawnEnemy, 3000);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  animate();
  setupControls();
}

function animate() {
  requestAnimationFrame(animate);

  let direction = new THREE.Vector3();
  if (keys.w) direction.z -= 1;
  if (keys.s) direction.z += 1;
  if (keys.a) direction.x -= 1;
  if (keys.d) direction.x += 1;

  if (direction.length() > 0) {
    direction.normalize();
    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    camera.position.add(direction.multiplyScalar(moveSpeed));
  }

  bullets.forEach((bullet, index) => {
    bullet.position.add(bullet.velocity);

enemies.forEach((enemy, enemyIndex) => {
  bullets.forEach((bullet, index) => {
    if (bullet.position.distanceTo(enemy.mesh.position) < 0.5) {
      enemy.health -= 10;
      scene.remove(bullet);
      bullets.splice(index, 1);

      showHealthBar(enemy);

      if (enemy.health <= 0) {
        scene.remove(enemy.mesh);
        scene.remove(enemy.healthBar);
        enemies.splice(enemyIndex, 1);
      }
    }
  });
});

    if (bullet.position.distanceTo(camera.position) > 50) {
      scene.remove(bullet);
      bullets.splice(index, 1);
    }
  });

  enemies.forEach((enemy) => {
    let direction = new THREE.Vector3().subVectors(camera.position, enemy.mesh.position).normalize();
    enemy.mesh.position.add(direction.multiplyScalar(0.01));

    if (enemy.mesh.position.distanceTo(camera.position) < 1) {
      playerHealth -= 0.1;
      if (playerHealth <= 0) {
        playerHealth = 0;
        alert("Game Over!");
      }
    }
  });

  if (playerHealth < maxPlayerHealth) {
    playerHealth = Math.min(maxPlayerHealth, playerHealth + healthRegenRate);
  }

  document.getElementById("healthBar").style.width = (playerHealth / maxPlayerHealth) * 100 + "%";

  renderer.render(scene, camera);
}

const grassMonsterTexture = new THREE.TextureLoader().load('./assets/grassmonster.png');

function spawnEnemy() {
  const boxGeometry = new THREE.BoxGeometry();
  const boxMaterial = new THREE.MeshBasicMaterial({ map: grassMonsterTexture });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(Math.random() * 20 - 10, 0.5, Math.random() * 20 - 10);

  const enemy = {
    mesh: box,
    health: 30,
    healthBar: null,
  };

  enemies.push(enemy);
  scene.add(box);
}

function showHealthBar(enemy) {
  if (!enemy.healthBar) {
    const healthBarGeometry = new THREE.PlaneGeometry(1, 0.1);
    const healthBarMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const healthBar = new THREE.Mesh(healthBarGeometry, healthBarMaterial);
    healthBar.position.set(enemy.mesh.position.x, enemy.mesh.position.y + 1, enemy.mesh.position.z);
    enemy.healthBar = healthBar;
    scene.add(healthBar);
  }

  if (enemy.healthBar) {
    const healthPercentage = Math.max(0, enemy.health) / 30;
    enemy.healthBar.scale.x = healthPercentage;
    const color = new THREE.Color(0x00ff00).lerp(new THREE.Color(0xff0000), 1 - healthPercentage);
    enemy.healthBar.material.color.set(color);
  }
}

function setupControls() {
  window.addEventListener("keydown", (event) => {
    if (event.key === "w") keys.w = true;
    if (event.key === "a") keys.a = true;
    if (event.key === "s") keys.s = true;
    if (event.key === "d") keys.d = true;
  });

  window.addEventListener("keyup", (event) => {
    if (event.key === "w") keys.w = false;
    if (event.key === "a") keys.a = false;
    if (event.key === "s") keys.s = false;
    if (event.key === "d") keys.d = false;
  });
}

function shoot() {
  const bulletGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8); // idc if this looks nothing like grass
  const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);

  bullet.position.set(camera.position.x, camera.position.y, camera.position.z);
  bullet.velocity = new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation).multiplyScalar(0.5);

  bullet.rotation.x = Math.PI / 2;

  bullets.push(bullet);
  scene.add(bullet);
}

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

init();
