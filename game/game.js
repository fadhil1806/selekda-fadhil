const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

// Player setup
const player1 = {
    x: 50,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    color: 'blue',
    score: 0,
    velocityX: 0,
    velocityY: 0,
};

const player2 = {
    x: 700,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    color: 'red',
    score: 0,
    velocityX: 0,
    velocityY: 0,
};

// Ball setup
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    color: 'white',
    velocityX: 4,
    velocityY: 4,
};

// Goal setup
const goalWidth = 100;
const goalHeight = 80;

const goal1 = {
    x: 0,
    y: canvas.height - goalHeight,
    width: goalWidth,
    height: goalHeight,
};

const goal2 = {
    x: canvas.width - goalWidth,
    y: canvas.height - goalHeight,
    width: goalWidth,
    height: goalHeight,
};

// Gravity and jumping
const gravity = 0.5;

// Game loop
function update() {
    // Player 1 movement
    player1.x += player1.velocityX;
    player1.y += player1.velocityY;

    // Player 2 movement
    player2.x += player2.velocityX;
    player2.y += player2.velocityY;

    // Apply boundaries for player 1
    player1.x = Math.max(0, Math.min(canvas.width - player1.width, player1.x));
    player1.y = Math.max(0, Math.min(canvas.height - player1.height, player1.y));

    // Apply boundaries for player 2
    player2.x = Math.max(0, Math.min(canvas.width - player2.width, player2.x));
    player2.y = Math.max(0, Math.min(canvas.height - player2.height, player2.y));

    // Ball movement
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Collision with walls
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.velocityX *= -1;
    }

    // Collision with ceiling and floor
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY *= -1;
    }

    // Collision with players
    handlePlayerCollision(player1);
    handlePlayerCollision(player2);

    // Check if ball goes into goals
    checkGoal();

    // Draw everything
    draw();
    requestAnimationFrame(update);
}

// Handle ball collision with player
function handlePlayerCollision(player) {
    const dx = ball.x - (player.x + player.width / 2);
    const dy = ball.y - (player.y + player.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if ball is close enough to player to be intercepted
    if (distance < ball.radius + Math.min(player.width / 2, player.height / 2)) {
        const angle = Math.atan2(dy, dx);
        const speed = Math.sqrt(ball.velocityX * ball.velocityX + ball.velocityY * ball.velocityY);

        // Reflect ball velocity based on collision angle
        ball.velocityX = -speed * Math.cos(angle);
        ball.velocityY = -speed * Math.sin(angle);

        // Ensure the ball moves towards the direction of the player who intercepted it
        const playerDirectionX = player.x + player.width / 2 - ball.x;
        const playerDirectionY = player.y + player.height / 2 - ball.y;
        const length = Math.sqrt(playerDirectionX * playerDirectionX + playerDirectionY * playerDirectionY);
        ball.velocityX = (playerDirectionX / length) * speed;
        ball.velocityY = (playerDirectionY / length) * speed;
    }
}

// Check if ball enters a goal
function checkGoal() {
    if (
        ball.x - ball.radius < goal1.x + goal1.width &&
        ball.y > goal1.y &&
        ball.y < goal1.y + goal1.height
    ) {
        // Goal for Player 2
        player2.score++;
        resetBall();
    } else if (
        ball.x + ball.radius > goal2.x &&
        ball.y > goal2.y &&
        ball.y < goal2.y + goal2.height
    ) {
        // Goal for Player 1
        player1.score++;
        resetBall();
    }
}

// Reset ball position after a goal
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = 4 * (Math.random() > 0.5 ? 1 : -1);
    ball.velocityY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Draw function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw goals
    ctx.fillStyle = 'black';
    ctx.fillRect(goal1.x, goal1.y, goal1.width, goal1.height);
    ctx.fillRect(goal2.x, goal2.y, goal2.width, goal2.height);

    // Draw player 1
    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

    // Draw player 2
    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    // Draw scores
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(player1.score, canvas.width / 4, 50);
    ctx.fillText(player2.score, (canvas.width * 3) / 4, 50);
}

// Control keys
const keys = {};

window.addEventListener('keydown', (event) => {
    keys[event.key] = true;

    // Player 1 controls (Arrow keys)
    if (keys['ArrowLeft']) player1.velocityX = -5;
    if (keys['ArrowRight']) player1.velocityX = 5;
    if (keys['ArrowUp']) player1.velocityY = -5;
    if (keys['ArrowDown']) player1.velocityY = 5;

    // Player 2 controls (WASD)
    if (keys['a']) player2.velocityX = -5;
    if (keys['d']) player2.velocityX = 5;
    if (keys['w']) player2.velocityY = -5;
    if (keys['s']) player2.velocityY = 5;
});

window.addEventListener('keyup', (event) => {
    keys[event.key] = false;

    // Stop player movement when keys are released
    if (!keys['ArrowLeft'] && !keys['ArrowRight']) player1.velocityX = 0;
    if (!keys['ArrowUp'] && !keys['ArrowDown']) player1.velocityY = 0;
    
    if (!keys['a'] && !keys['d']) player2.velocityX = 0;
    if (!keys['w'] && !keys['s']) player2.velocityY = 0;
});

update();
