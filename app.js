const canvas = document.querySelector('.canvas');
const context = canvas.getContext('2d');

const background = new Image();
background.src = "images/background.png";
const apple = new Image();
apple.src = "images/apple.png";

const eat = new Audio("audio/eat.mp3");
const dead = new Audio("audio/dead.mp3");

let highScore = localStorage.getItem('highscore');
const box = 32;
let score = 0;
let snake = [];
let direction;
snake[0] = { x: 9 * box, y: 10 * box };
let food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box,
};

document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(event) {
    if (event.keyCode === 13) {
        window.location.reload();
    } else if (event.keyCode === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.keyCode === 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.keyCode === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (event.keyCode === 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}

function collision(head, array) {
    return array.some(item => head.x === item.x && head.y === item.y);
}

function draw() {
    context.drawImage(background, 0, 0);

    snake.forEach((snakePart, index) => {
        context.fillStyle = (index === 0) ? '#1bb21b' : '#116211';
        context.fillRect(snakePart.x, snakePart.y, box, box);
        context.strokeStyle = '#65320f';
        context.strokeRect(snakePart.x, snakePart.y, box, box);
    });

    context.drawImage(apple, food.x, food.y);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        eat.play();
        score++;
        food = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box,
        };
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    if (
        snakeX < box ||
        snakeX > 17 * box ||
        snakeY < 3 * box ||
        snakeY > 17 * box ||
        collision(newHead, snake)
    ) {
        dead.play();
        clearInterval(game);
    }

    snake.unshift(newHead);

    context.fillStyle = 'white';
    context.font = '45px sans-serif';
    context.fillText(score, 2 * box, 1.6 * box);

    context.fillText('Best score:', 8.6 * box, 1.55 * box);
    context.fillText(highScore, 16 * box, 1.6 * box);

    if (highScore !== null) {
        if (score > highScore) {
            localStorage.setItem('highscore', score);
        }
    } else {
        localStorage.setItem('highscore', score);
    }
}

let game = setInterval(draw, 105);
