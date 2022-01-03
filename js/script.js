const backBtn = '';
const result = '';
const playBtn = document.querySelector('.btn[name=startNewGameBtn]');
const records = document.querySelector('.btn[name=showRecordsBtn]');
const settings = document.querySelector('.btn[name=showSettingsBtn]');

const gameBoard = document.querySelector('.grid[name=gameBoard]');
const mainMenu = document.querySelector('.grid[name=mainMenu]');

const holes = document.querySelectorAll('.grid__col--image');
const moles = document.querySelectorAll('.grid__item');
let gameOver;

const getRandomInt = (minValue, maxValue, inclusive = 0) => {
    return Math.floor(Math.random() * (maxValue - minValue + inclusive)) + minValue;
}

const getRandomHole = (holes) => {
    const idx = getRandomInt(0, holes.length, 0);
    return holes[idx];
}

const showMole = (minTime, maxTime) => {
    const time = getRandomInt(minTime, maxTime);
    const currentHole = getRandomHole(holes);
    currentHole.classList.add('active');
    setTimeout(() => {
        currentHole.classList.remove('active');
        if (!gameOver)
            showMole(minTime, maxTime);
    }, time);
}

const startGame = () => {
    gameOver = false;
    mainMenu.classList.add('grid--hidden');
    gameBoard.classList.remove('grid--hidden');
    showMole(200, 1000);
    setTimeout(() => {
        gameOver = true;
    }, 2000);
}

playBtn.addEventListener('click', startGame);