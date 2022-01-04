const result = '';
const backBtn = document.querySelector('.header__btn[name=backBtn]');
const playBtn = document.querySelector('.btn[name=startNewGameBtn]');
const records = document.querySelector('.btn[name=showRecordsBtn]');
const settings = document.querySelector('.btn[name=showSettingsBtn]');

const gameBoard = document.querySelector('.grid[name=gameBoard]');
const mainMenu = document.querySelector('.grid[name=mainMenu]');

const holes = document.querySelectorAll('.grid__col--image');
const moles = document.querySelectorAll('.grid__item');

let gameOver;
let points;
let gameTimeout;

const getRandomInt = (minValue, maxValue, inclusive = 0) => {
    return Math.floor(Math.random() * (maxValue - minValue + inclusive)) + minValue;
}

const getRandomHole = (holes) => {
    const idx = getRandomInt(0, holes.length, 0);
    return holes[idx];
}

const showMole = (minTime, maxTime) => {
    const time = getRandomInt(minTime, maxTime);
    const currentHole = getRandomHole(moles);
    currentHole.classList.remove('grid__item--hidden');
    setTimeout(() => {
        currentHole.classList.add('grid__item--hidden');
        if (!gameOver)
            showMole(minTime, maxTime);
    }, time);
}

const startGame = () => {
    gameOver = false;
    points=0;
    mainMenu.classList.add('grid--hidden');
    gameBoard.classList.remove('grid--hidden');
    showMole(200, 1000);
    gameTimeout = setTimeout(() => {
        gameOver = true;
    }, 20000);
}

function hit(e) {
    if(!e.isTrusted)
        return;
    this.classList.add('grid__item--hidden');
    points++;
    console.log(points);
}

function showMainMenu() {
    clearTimeout(gameTimeout);
    gameBoard.classList.add('grid--hidden');
    mainMenu.classList.remove('grid--hidden');
}

playBtn.addEventListener('click', startGame);
backBtn.addEventListener('click', showMainMenu);
moles.forEach(mole => mole.addEventListener('click',hit));