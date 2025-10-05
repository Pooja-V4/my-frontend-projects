const player = document.querySelector('.player');
const gameContainer = document.querySelector('.game-container');
const scoreDisplay = document.querySelector('.score');
const healthFill = document.querySelector('.health-fill');
const gameOverScreen = document.querySelector('.game-over');
const finalScore = document.querySelector('#final-score');

let enemyIntervals = [];
let powerUpIntervals = [];
let enemySpawnInterval;
let powerUpSpawnInterval;

let score = 0;
let health = 100;
let isGameActive = true;
let powerUpActive = false;

let bullets = [];
let enemies = [];
let powerUps = [];

const shootSound = new Audio('assets/audios/shoot.mp3');
const powerUpSound = new Audio('assets/audios/powerups.mp3');

function updateScore(amount) {
    score = Math.max(0, score + amount);
    scoreDisplay.textContent = `SCORE: ${score}`;
    console.log(`Score changed by ${amount}. New score: ${score}`);
}

document.addEventListener('keydown', (e) => {
  if (!isGameActive) return;

  const speed = 20;
  const playerRect = player.getBoundingClientRect();
  const containerRect = gameContainer.getBoundingClientRect();

  switch (e.key) {
    case 'ArrowLeft':
      if (playerRect.left > containerRect.left)
        player.style.left = `${player.offsetLeft - speed}px`;
      break;
    case 'ArrowRight':
      if (playerRect.right < containerRect.right)
        player.style.left = `${player.offsetLeft + speed}px`;
      break;
  }
});

function shoot() {
  const bullet = document.createElement('div');
  bullet.className = 'bullet';
  
  const playerRect = player.getBoundingClientRect();
  const containerRect = gameContainer.getBoundingClientRect();
  const bulletX = playerRect.left - containerRect.left + playerRect.width / 2 - 4;
  const bulletY = playerRect.top - containerRect.top;
  
  bullet.style.left = `${bulletX}px`;
  bullet.style.top = `${bulletY}px`;
  gameContainer.appendChild(bullet);
  bullets.push(bullet);

  const flash = document.createElement('div');
  flash.className = 'muzzle-flash';
  flash.style.left = `${bulletX - 6}px`;
  flash.style.top = `${bulletY - 10}px`;
  gameContainer.appendChild(flash);
  setTimeout(() => flash.remove(), 100);

  let trailCount = 0;
  const trailInterval = setInterval(() => {
    if (!isGameActive || trailCount > 3) {
      clearInterval(trailInterval);
      return;
    }
    
    const trail = document.createElement('div');
    trail.className = 'bullet-trail';
    trail.style.left = `${bulletX + Math.random() * 4 - 2}px`;
    trail.style.top = `${parseInt(bullet.style.top) + 15}px`;
    gameContainer.appendChild(trail);
    setTimeout(() => trail.remove(), 500);
    trailCount++;
  }, 50);

  const bulletInterval = setInterval(() => {
    if (!isGameActive) {
      clearInterval(bulletInterval);
      return;
    }

    const currentTop = parseInt(bullet.style.top) || 0;
    bullet.style.top = `${currentTop - 20}px`;

    if (currentTop < -20) {
      bullet.remove();
      bullets = bullets.filter(b => b !== bullet);
      clearInterval(bulletInterval);
    }
  }, 16);

  shootSound.play();
}

let isShooting = false;
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && isGameActive && !isShooting) {
    isShooting = true;
    shoot();
    const rapidFire = setInterval(() => {
      if (!isShooting || !isGameActive) clearInterval(rapidFire);
      else shoot();
    }, 150);
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') isShooting = false;
});

function spawnEnemy() {
  if (!isGameActive) return;

  const enemy = document.createElement('div');
  enemy.className = 'enemy';
  enemy.style.left = `${Math.random() * (gameContainer.offsetWidth - 50)}px`;
  enemy.style.top = '0';
  gameContainer.appendChild(enemy);
  enemies.push(enemy);

  let enemyHit = false;
  let intervalRef = null;
  
  const enemyTimeLimit = setTimeout(() => {
    if (!isGameActive || enemyHit) {
      console.log('Timeout cancelled - game inactive or enemy already hit');
      return;
    }

    const enemyIndex = enemies.indexOf(enemy);
    console.log('Enemy timeout fired! Enemy index:', enemyIndex);
    
    if (enemyIndex !== -1) {
      console.log('BEFORE DAMAGE - Health:', health);
      takeDamage(5);
      console.log('AFTER DAMAGE - Health:', health);

      enemy.remove();
      enemies.splice(enemyIndex, 1);
      if (intervalRef) clearInterval(intervalRef);
    }
  }, 5000);
  
  enemy.timeLimit = enemyTimeLimit;

  const enemyInterval = setInterval(() => {
    if (!isGameActive) {
      clearInterval(enemyInterval);
      clearTimeout(enemyTimeLimit);
      return;
    }

    const currentTop = parseInt(enemy.style.top) || 0;
    enemy.style.top = `${currentTop + 2}px`;

    const enemyRect = enemy.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      enemyRect.left < playerRect.right &&
      enemyRect.right > playerRect.left &&
      enemyRect.top < playerRect.bottom &&
      enemyRect.bottom > playerRect.top
    ) {
      enemyHit = true;
      takeDamage(10);
      createExplosion(enemyRect.left, enemyRect.top);
      enemy.remove();
      enemies = enemies.filter(e => e !== enemy);
      clearInterval(enemyInterval);
      clearTimeout(enemyTimeLimit);
      return;
    }

    if (currentTop > gameContainer.offsetHeight) {
      enemyHit = true; // Mark as hit so timeout doesn't fire
      enemy.remove();
      enemies = enemies.filter(e => e !== enemy);
      clearInterval(enemyInterval);
      clearTimeout(enemyTimeLimit);
    }
  }, 16);
  
  intervalRef = enemyInterval;
  enemyIntervals.push(enemyInterval);
}

function spawnPowerUp() {
  if (!isGameActive) return;
  const powerUp = document.createElement('div');
  powerUp.className = 'power-up';
  powerUp.style.left = `${Math.random() * (gameContainer.offsetWidth - 70)}px`;
  powerUp.style.top = '0';
  gameContainer.appendChild(powerUp);
  powerUps.push(powerUp);

  const powerUpInterval = setInterval(() => {
    if (!isGameActive) {
      clearInterval(powerUpInterval);
      return;
    }

    const currentTop = parseInt(powerUp.style.top) || 0;
    powerUp.style.top = `${currentTop + 2}px`;

    const powerUpRect = powerUp.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      powerUpRect.left < playerRect.right &&
      powerUpRect.right > playerRect.left &&
      powerUpRect.top < playerRect.bottom &&
      powerUpRect.bottom > playerRect.top
    ) {
      activatePowerUp();
      powerUp.remove();
      powerUps = powerUps.filter(p => p !== powerUp);
      clearInterval(powerUpInterval);
    }

    if (currentTop > gameContainer.offsetHeight) {
      powerUp.remove();
      powerUps = powerUps.filter(p => p !== powerUp);
      clearInterval(powerUpInterval);
    }
  }, 16);
  powerUpIntervals.push(powerUpInterval);
}

function activatePowerUp() {
  powerUpActive = true;
  powerUpSound.play();
  player.style.filter = 'drop-shadow(0 0 20px #00ff00)';
  setTimeout(() => {
    powerUpActive = false;
    player.style.filter = 'drop-shadow(0 0 10px #00f7ff)';
  }, 5000);
}

function createExplosion(x, y) {
  const explosion = document.createElement('div');
  explosion.className = 'explosion';
  explosion.style.left = `${x - 25}px`;
  explosion.style.top = `${y - 25}px`;
  gameContainer.appendChild(explosion);
  
  setTimeout(() => {
    explosion.remove();
  }, 300);
}

function takeDamage(amount) {
  health = Math.max(0, health - amount);
  
  // Force update the health fill width
  const healthFillElement = document.querySelector('.health-fill');
  healthFillElement.style.width = `${health}%`;
  
  console.log(`Damage taken: ${amount}. Health remaining: ${health}%`);
  console.log(`Health bar width set to: ${healthFillElement.style.width}`);
  
  const healthBar = document.querySelector('.health-bar');
  healthBar.classList.add('damage');
  setTimeout(() => healthBar.classList.remove('damage'), 500);

  const flash = document.createElement('div');
  flash.style.position = 'fixed';
  flash.style.top = '0';
  flash.style.left = '0';
  flash.style.width = '100%';
  flash.style.height = '100%';
  flash.style.background = 'rgba(255, 0, 55, 0.5)';
  flash.style.pointerEvents = 'none';
  flash.style.zIndex = '99';
  flash.style.animation = 'flashDamage 0.5s ease-out';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 500);
  
  const damageText = document.createElement('div');
  damageText.textContent = `-${amount} HP`;
  damageText.style.position = 'absolute';
  damageText.style.left = player.style.left;
  damageText.style.bottom = `${player.getBoundingClientRect().bottom - gameContainer.getBoundingClientRect().top + 20}px`;
  damageText.style.color = '#ff0037';
  damageText.style.fontSize = '48px';
  damageText.style.fontWeight = 'bold';
  damageText.style.textShadow = '0 0 20px #ff0037, 0 0 40px #ff0037';
  damageText.style.pointerEvents = 'none';
  damageText.style.zIndex = '50';
  damageText.style.animation = 'floatUp 1.5s forwards';
  gameContainer.appendChild(damageText);
  setTimeout(() => damageText.remove(), 1500);
  
  player.style.animation = 'shake 0.5s';
  setTimeout(() => player.style.animation = '', 500);

  if (health <= 0) {
    gameOver();
  }
}

function checkCollisions() {
  const bulletsToRemove = [];
  const enemiesToRemove = [];

  bullets.forEach((bullet) => {
    const bulletRect = bullet.getBoundingClientRect();
    enemies.forEach((enemy) => {
      const enemyRect = enemy.getBoundingClientRect();

      if (
        bulletRect.left < enemyRect.right &&
        bulletRect.right > enemyRect.left &&
        bulletRect.top < enemyRect.bottom &&
        bulletRect.bottom > enemyRect.top
      ) {
        if (!bulletsToRemove.includes(bullet)) bulletsToRemove.push(bullet);
        if (!enemiesToRemove.includes(enemy)) {
          enemiesToRemove.push(enemy);
          enemy.wasHit = true;
        }

        updateScore(powerUpActive ? 20 : 10);
        createExplosion(enemyRect.left, enemyRect.top);
      }
    });
  });

  bulletsToRemove.forEach(bullet => bullet.remove());
  enemiesToRemove.forEach(enemy => {
    if (enemy.timeLimit) {
      clearTimeout(enemy.timeLimit);
    }
    enemy.remove();
  });

  bullets = bullets.filter(b => !bulletsToRemove.includes(b));
  enemies = enemies.filter(e => !enemiesToRemove.includes(e));
}

function gameLoop() {
  if (!isGameActive) return;

  checkCollisions();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  if (enemySpawnInterval) clearInterval(enemySpawnInterval);
  if (powerUpSpawnInterval) clearInterval(powerUpSpawnInterval);
  enemyIntervals.forEach(clearInterval);
  powerUpIntervals.forEach(clearInterval);

  health = 100;
  score = 0;
  isGameActive = true;
  powerUpActive = false;
  healthFill.style.width = '100%';
  scoreDisplay.textContent = 'SCORE: 0';
  
  document.querySelectorAll('.enemy, .bullet, .power-up, .explosion').forEach(e => e.remove());

  bullets = [];
  enemies = [];
  powerUps = [];
  enemyIntervals = [];
  powerUpIntervals = [];

  enemySpawnInterval = setInterval(spawnEnemy, 1500);
  powerUpSpawnInterval = setInterval(spawnPowerUp, 10000);
  gameLoop();
}

function gameOver() {
  isGameActive = false;
  finalScore.textContent = score;
  gameOverScreen.style.display = 'block';

  clearInterval(enemySpawnInterval);
  clearInterval(powerUpSpawnInterval);
  enemyIntervals.forEach(interval => clearInterval(interval));
  powerUpIntervals.forEach(interval => clearInterval(interval));

  document.querySelectorAll('.enemy, .bullet, .power-up, .explosion').forEach(e => e.remove());
  enemies = [];
  bullets = [];
  powerUps = [];
  enemyIntervals = [];
  powerUpIntervals = [];
}

document.querySelector('.play-again-btn').addEventListener('click', () => {
  gameOverScreen.style.display = 'none';
  startGame();
});

startGame();