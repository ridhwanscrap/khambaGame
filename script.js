const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('finalScore');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartBtn = document.getElementById('restartBtn');

// Game Constants
const GROUND_Y = 320; 

// Game Variables
let frames = 0;
let score = 0;
let gameRunning = true;
let gameSpeed = 6;
let poles = [];
let policeCars = [];

// The Bandit (Player)
const player = {
    x: 50,
    y: GROUND_Y,
    width: 55,
    height: 85,
    dy: 0, 
    jumpPower: -15,
    gravity: 0.8,
    grounded: false
};

// Character Colors
const charColors = {
    skin: "#f1c27d",
    hair: "#1a1a1a", // Dark grey/black for thinner look
    shirt: "#ffffff",
    pants: "#555555",
    shoes: "#3e2723",
    belt: "#000000",
    buckle: "#aaaaaa"
};

// --- INPUT HANDLING ---
let keys = {};

window.addEventListener('keydown', function (e) {
    keys[e.code] = true;
    if(e.code === "Space") e.preventDefault();
    
    if ((e.code === 'Space' || e.code === 'ArrowUp') && player.grounded && gameRunning) {
        jump();
    }
});

window.addEventListener('keyup', function (e) {
    keys[e.code] = false;
});

// Mobile Touch Support (UPDATED: Listen on 'document' to detect taps anywhere)
document.addEventListener('touchstart', function(e) {
    // Prevent jump if the user is tapping the "Run Again" button
    if (e.target.closest('button')) return;

    e.preventDefault(); // Prevents scrolling
    if (player.grounded && gameRunning) {
        jump();
    }
}, { passive: false });

if(restartBtn) {
    restartBtn.addEventListener('click', resetGame);
    restartBtn.addEventListener('touchstart', resetGame, { passive: false });
}

function jump() {
    player.dy = player.jumpPower;
    player.grounded = false;
}

// --- GAME LOGIC ---

function spawnPole() {
    poles.push({
        x: canvas.width,
        y: GROUND_Y - 80,
        width: 20,
        height: 100,
        collected: false
    });
}

function spawnPolice() {
    policeCars.push({
        x: canvas.width,
        y: GROUND_Y - 40,
        width: 70,
        height: 40,
        lightTimer: 0
    });
}

function update() {
    if (!gameRunning) return;

    frames++;

    // 1. Physics (Player)
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y > GROUND_Y - player.height) {
        player.y = GROUND_Y - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    // 2. Difficulty Scaling
    if (frames % 500 === 0) gameSpeed += 0.5;

    // 3. Spawning Logic
    if (frames % 100 === 0) {
        if (Math.random() > 0.2) spawnPole();
    }
    
    if (frames % 150 === 0) {
        if (Math.random() > 0.5) spawnPolice(); 
    }

    // 4. Update Poles
    for (let i = 0; i < poles.length; i++) {
        let p = poles[i];
        p.x -= gameSpeed;

        if (!p.collected && 
            player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y < p.y + p.height &&
            player.y + player.height > p.y) {
            
            p.collected = true;
            score++;
            scoreEl.innerText = score;
        }
    }
    poles = poles.filter(p => p.x + p.width > 0 && !p.collected);

    // 5. Update Police
    for (let i = 0; i < policeCars.length; i++) {
        let c = policeCars[i];
        c.x -= (gameSpeed + 2);
        c.lightTimer++;

        // Hitbox Detection
        if (player.x + 10 < c.x + c.width - 5 &&
            player.x + player.width - 10 > c.x + 5 &&
            player.y + 10 < c.y + c.height &&
            player.y + player.height > c.y) {
            
            gameOver();
        }
    }
    policeCars = policeCars.filter(c => c.x + c.width > 0);

    draw();
    requestAnimationFrame(update);
}

// --- DRAWING LOGIC ---

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Poles
    for (let p of poles) {
        ctx.fillStyle = '#6d4c41';
        ctx.fillRect(p.x, p.y, p.width, p.height);
        ctx.fillRect(p.x - 10, p.y + 10, p.width + 20, 5);
        ctx.strokeStyle = '#333';
        ctx.beginPath();
        ctx.moveTo(p.x - 10, p.y + 10);
        ctx.lineTo(p.x - 50, p.y - 10);
        ctx.stroke();
    }

    // Draw Character
    drawCharacter();

    // Draw Police Cars
    for (let c of policeCars) {
        ctx.fillStyle = '#0d47a1'; ctx.fillRect(c.x, c.y + 10, c.width, 30);
        ctx.fillStyle = 'white'; ctx.fillRect(c.x + 15, c.y, 40, 15);
        
        // Siren
        if (Math.floor(c.lightTimer / 10) % 2 === 0) {
            ctx.fillStyle = 'red'; ctx.fillRect(c.x + 20, c.y - 5, 10, 5);
            ctx.fillStyle = 'darkblue'; ctx.fillRect(c.x + 40, c.y - 5, 10, 5);
        } else {
            ctx.fillStyle = 'darkred'; ctx.fillRect(c.x + 20, c.y - 5, 10, 5);
            ctx.fillStyle = 'blue'; ctx.fillRect(c.x + 40, c.y - 5, 10, 5);
        }
    }
}

function drawCharacter() {
    ctx.save();
    ctx.translate(player.x, player.y);

    // Legs (Pants)
    ctx.fillStyle = charColors.pants;
    ctx.fillRect(10, 50, 15, 30); // Left
    ctx.fillRect(30, 50, 15, 30); // Right
    
    // Shoes
    ctx.fillStyle = charColors.shoes;
    ctx.beginPath(); ctx.ellipse(17.5, 80, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(37.5, 80, 8, 4, 0, 0, Math.PI * 2); ctx.fill();

    // Torso (Shirt)
    ctx.fillStyle = charColors.shirt;
    ctx.beginPath();
    ctx.moveTo(5, 20); ctx.lineTo(50, 20);
    ctx.quadraticCurveTo(55, 35, 50, 50); 
    ctx.lineTo(5, 50);
    ctx.quadraticCurveTo(0, 35, 5, 20);
    ctx.fill();

    // Buttons
    ctx.fillStyle = "#ddd";
    for(let i=0; i<3; i++) { ctx.beginPath(); ctx.arc(27.5, 25 + i*8, 2, 0, Math.PI*2); ctx.fill(); }

    // Belt
    ctx.fillStyle = charColors.belt; ctx.fillRect(5, 48, 45, 4);
    ctx.fillStyle = charColors.buckle; ctx.fillRect(25, 47, 6, 6);

    // Head
    ctx.fillStyle = charColors.skin;
    ctx.beginPath(); ctx.ellipse(27.5, 10, 18, 15, 0, 0, Math.PI * 2); ctx.fill();

    // --- THIN HAIR CODE ---
    ctx.fillStyle = charColors.hair;
    ctx.beginPath();
    // Start at left temple (receding)
    ctx.moveTo(15, 2); 
    // Curve over top (flatter, less volume for thin look)
    ctx.quadraticCurveTo(27.5, -6, 40, 2); 
    // Right side
    ctx.lineTo(40, 7); 
    // Front hairline (curved up to show forehead - receding look)
    ctx.quadraticCurveTo(27.5, 0, 15, 7); 
    ctx.fill();
    
    // Optional: A small "part" line to add texture
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(20, 2); ctx.quadraticCurveTo(25, -2, 30, 2); ctx.stroke();
    // --------------------------

    // Glasses & Face
    ctx.strokeStyle = "#000"; ctx.lineWidth = 2;
    ctx.strokeRect(15, 5, 10, 6); ctx.strokeRect(30, 5, 10, 6);
    ctx.beginPath(); ctx.moveTo(25, 8); ctx.lineTo(30, 8); ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.beginPath(); ctx.arc(20, 8, 1.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(35, 8, 1.5, 0, Math.PI*2); ctx.fill();
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(27.5, 12); ctx.quadraticCurveTo(25, 15, 27.5, 18); ctx.stroke(); // Nose
    ctx.beginPath(); ctx.moveTo(22, 22); ctx.lineTo(33, 22); ctx.stroke(); // Mouth

    // Arms (Simple Swing Animation)
    ctx.fillStyle = charColors.shirt;
    // Left arm
    ctx.save(); ctx.translate(5, 25); ctx.rotate(Math.sin(frames/8) * 0.5); 
    ctx.fillRect(0, 0, 8, 22); 
    ctx.fillStyle = charColors.skin; ctx.fillRect(0, 22, 8, 6); ctx.restore();
    // Right arm
    ctx.save(); ctx.translate(50, 25); ctx.rotate(-Math.sin(frames/8) * 0.5);
    ctx.fillRect(-8, 0, 8, 22);
    ctx.fillStyle = charColors.skin; ctx.fillRect(-8, 22, 8, 6); ctx.restore();

    ctx.restore(); 
}

function gameOver() {
    gameRunning = false;
    finalScoreEl.innerText = score;
    gameOverScreen.style.display = 'flex';
}

function resetGame() {
    player.y = GROUND_Y - player.height;
    player.dy = 0;
    poles = [];
    policeCars = [];
    score = 0;
    frames = 0;
    gameSpeed = 6;
    gameRunning = true;
    
    scoreEl.innerText = '0';
    gameOverScreen.style.display = 'none';
    
    update();
}

// Start Loop
update();