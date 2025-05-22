// Asegúrate de que este es el contenido actual de tu game.js
// y que el resto de tu lógica del juego (movimiento, comida, colisiones) está aquí.

// --- Variables y configuración inicial ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');

const gridSize = 20; // Tamaño de cada segmento de la serpiente
let snake; // Se inicializa en startGame()
let food;  // Se inicializa en generateFood()
let direction; // Se inicializa en startGame()
let score; // Se inicializa en startGame()
let highScore = localStorage.getItem('snakeHighScore') || 0; // Carga la puntuación más alta desde localStorage
let gameInterval;
let gameSpeed = 150; // Velocidad del juego en milisegundos

// Actualizar la visualización de la puntuación más alta al inicio
highScoreDisplay.textContent = highScore;
highScoreDisplay.dataset.highScore = highScore;

// --- Funciones del juego ---

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
    // Asegurarse de que la comida no aparezca dentro de la serpiente
    for (let i = 0; i < snake.length; i++) {
        if (food.x === snake[i].x && food.y === snake[i].y) {
            generateFood(); // Regenerar si la comida está en la serpiente
            return;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

    // Dibujar serpiente
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'lime'; // Cabeza verde, cuerpo lima
        ctx.strokeStyle = 'darkgreen';
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
        ctx.strokeRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }

    // Dibujar comida
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    ctx.strokeRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function update() {
    const head = { x: snake[0].x, y: snake[0].y };

    // Mover la cabeza
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

    // Comprobar colisiones
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

    snake.unshift(head); // Añadir nueva cabeza

    // Comprobar si come la comida
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        generateFood();
        // Opcional: Aumentar ligeramente la velocidad a medida que crece la serpiente
        // gameSpeed = Math.max(50, gameSpeed - 5);
        // clearInterval(gameInterval);
        // gameInterval = setInterval(update, gameSpeed);
    } else {
        snake.pop(); // Eliminar la cola si no come
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
    alert('¡Fin del juego! Tu puntuación: ' + score);

    // Guardar la puntuación más alta si la actual es mayor
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore); // Guarda en localStorage
        highScoreDisplay.textContent = highScore;
        highScoreDisplay.dataset.highScore = highScore;
    }

    // Reiniciar el juego después de un breve retraso o interacción
    // Para reiniciar automáticamente, llama a startGame()
    startGame();
}

// --- Controles de teclado y táctiles ---
document.addEventListener('keydown', e => {
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

// Función para manejar los controles táctiles (llamada desde index.html)
function handleSwipe(newDirection) {
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
    // Configurar dimensiones del canvas (asegúrate de que estas estén aquí o en tu CSS)
    canvas.width = 400; // Puedes ajustar el tamaño del canvas
    canvas.height = 400; // Puedes ajustar el tamaño del canvas

    // Inicializar las variables del juego
    snake = [{ x: 10, y: 10 }]; // Posición inicial de la serpiente
    direction = 'right';
    score = 0;
    scoreDisplay.textContent = score; // Asegúrate de que el score se reinicie visualmente

    generateFood(); // Generar la primera comida
    draw(); // Dibujar el estado inicial del juego

    // Limpiar cualquier intervalo anterior para evitar múltiples bucles de juego
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    gameInterval = setInterval(update, gameSpeed); // Iniciar el bucle principal del juego
}

// --- Inicio del juego cuando la página se carga ---
// Llama a startGame() para iniciar el juego automáticamente.
// Asegúrate de que esta llamada está al final del script.
startGame();