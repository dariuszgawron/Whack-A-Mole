// localStorage 
const userName = JSON.parse(localStorage.getItem('moleUserName')) || '';
const scoreBoard = JSON.parse(localStorage.getItem('molePoints')) || [];

// controls
const scoreBox = document.querySelector('.header__box[name=score]');
const backBtn = document.querySelector('.header__btn[name=backBtn]');
const playBtn = document.querySelector('.btn[name=startNewGameBtn]');
const settingsBtn = document.querySelector('.btn[name=showSettingsBtn]');
const records = document.querySelector('.btn[name=showRecordsBtn]');

// screens
const gameBoard = document.querySelector('.grid[name=gameBoard]');
const mainMenu = document.querySelector('.grid[name=mainMenu]');
const settings = document.querySelector('.grid[name=settings]');

// game 
const holes = document.querySelectorAll('.grid__col--image');
const moles = document.querySelectorAll('.grid__item');

// sounds
const audio = document.querySelector(`audio[data-key='bang']`);

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
    points = 0;
    scoreBox.textContent = points;
    mainMenu.classList.add('grid--hidden');
    gameBoard.classList.remove('grid--hidden');
    backBtn.classList.remove('header__btn--hidden');
    scoreBox.classList.remove('header__box--hidden');
    showMole(200, 1000);
    gameTimeout = setTimeout(() => {
        gameOver = true;
        saveResult(scoreBoard, userName, points);
    }, 20000);
}

function hit(e) {
    if (!e.isTrusted)
        return;
    this.classList.add('grid__item--hidden');
    audio.currentTime = 0;
    audio.play();
    scoreBox.textContent = ++points;
    // console.log(points);
}

function showMainMenu() {
    gameOver = true;
    clearTimeout(gameTimeout);
    gameBoard.classList.add('grid--hidden');
    settings.classList.add('grid--hidden');
    mainMenu.classList.remove('grid--hidden');
    backBtn.classList.add('header__btn--hidden');
    scoreBox.classList.add('header__box--hidden');
}

function saveResult(scoreBoard, userName, points) {
    scoreBoard.push({
        playerName: userName,
        level: 'easy',
        points: points
    });

    localStorage.setItem('molePoints', JSON.stringify(scoreBoard));
}

function showSettings() {
    mainMenu.classList.add('grid--hidden');
    settings.classList.remove('grid--hidden');
    backBtn.classList.remove('header__btn--hidden');
}

playBtn.addEventListener('click', startGame);
settingsBtn.addEventListener('click', showSettings);
backBtn.addEventListener('click', showMainMenu);
moles.forEach(mole => mole.addEventListener('click', hit));