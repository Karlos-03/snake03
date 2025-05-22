// --- Variables y configuración inicial ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');

// Nuevos elementos HTML
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const gamePlayArea = document.getElementById('gamePlayArea'); // Nuevo contenedor para el juego

const gridSize = 20;
let snake;
let food;
let direction;
let score;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameInterval;
let gameSpeed = 150;
let gameStarted = false; // Nueva variable para controlar el estado del juego

// Actualizar la visualización de la puntuación más alta al inicio
highScoreDisplay.textContent = highScore;
highScoreDisplay.dataset.highScore = highScore;

// --- Funciones del juego ---

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
    for (let i = 0; i < snake.length; i++) {
        if (food.x === snake[i].x && food.y === snake[i].y) {
            generateFood();
            return;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'lime';
        ctx.strokeStyle = 'darkgreen';
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
        ctx.strokeRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }

    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    ctx.strokeRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function update() {
    if (!gameStarted) return; // No actualizar si el juego no ha iniciado

    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    if (
        head.x < 0 ||
        head.x >= canvas.width / gridSize ||
        head.y < 0 ||
        head.y >= canvas.height / gridSize ||
        checkCollision(head)
    ) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    draw();
}

function checkCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function endGame() {
    clearInterval(gameInterval);
    gameStarted = false; // El juego ha terminado

    // Mostrar pantalla de Game Over y ocultar área de juego
    gamePlayArea.classList.remove('active');
    gameOverScreen.classList.add('active');
    finalScoreDisplay.textContent = score; // Muestra la puntuación final

    // Guardar la puntuación más alta si la actual es mayor
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreDisplay.textContent = highScore;
        highScoreDisplay.dataset.highScore = highScore;
    }
}

// --- Controles de teclado y táctiles ---
document.addEventListener('keydown', e => {
    // Solo permitir control si el juego ha iniciado
    if (!gameStarted) return; 

    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

function handleSwipe(newDirection) {
    // Solo permitir control si el juego ha iniciado
    if (!gameStarted) return; 

    switch (newDirection) {
        case 'up':
            if (direction !== 'down') direction = 'up';
            break;
        case 'down':
            if (direction !== 'up') direction = 'down';
            break;
        case 'left':
            if (direction !== 'right') direction = 'left';
            break;
        case 'right':
            if (direction !== 'left') direction = 'right';
            break;
    }
}

// --- Función para iniciar o reiniciar el juego ---
function startGame() {
    // Ocultar pantallas de inicio/fin y mostrar área de juego
    startScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
    gamePlayArea.classList.add('active');

    // Configurar dimensiones del canvas
    canvas.width = 400;
    canvas.height = 400;

    // Inicializar las variables del juego
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    score = 0;
    scoreDisplay.textContent = score;

    generateFood();
    draw(); // Dibuja el estado inicial (serpiente y comida)

    // Limpiar cualquier intervalo anterior
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    gameInterval = setInterval(update, gameSpeed); // Iniciar el bucle principal

    gameStarted = true; // Establecer el estado del juego a iniciado
}

// --- Event Listeners para los botones ---
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// --- Inicialización al cargar la página ---
// No llamamos a startGame() aquí. La pantalla de inicio se mostrará por defecto.
// La primera vez que se carga la página, gameStarted es false, y se espera el clic del botón.