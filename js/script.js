// localStorage 
let moleSettings = JSON.parse(localStorage.getItem('moleSettings')) || {
    userName: '',
    level: '0',
    duration: '15',
    sound: true
};
let gameResults = JSON.parse(localStorage.getItem('molePoints')) || [];

const levels = {
    '0': {
        min: 600,
        max: 800
    },
    '1': {
        min: 400,
        max: 600
    },
    '2': {
        min: 200,
        max: 400
    }
}

// controls
const scoreBox = document.querySelector('.header__box[name=score]');
const backBtn = document.querySelector('.header__btn[name=backBtn]');
const playBtn = document.querySelector('.btn[name=startNewGameBtn]');
const settingsBtn = document.querySelector('.btn[name=showSettingsBtn]');
const recordsBtn = document.querySelector('.btn[name=showRecordsBtn]');
const playAgainBtn = document.querySelector('.box-ask-btn[name=playAgainBtn]');
const mainMenuBtn = document.querySelector('.box-ask-btn[name=mainMenuBtn]');
const boxAskResult = document.querySelector('.box-ask__text[name=boxAskResult]');
const showRecordsBtn = document.querySelector('.btn[name=showRecordsBtn]');

// screens
const gameBoard = document.querySelector('.grid[name=gameBoard]');
const mainMenu = document.querySelector('.grid[name=mainMenu]');
const settings = document.querySelector('.grid[name=settings]');
const scoreBoard = document.querySelector('.grid[name=scoreBoard]');

// settings screen
const userName = document.querySelector('.grid__input[name=userName]');
const gameLevel = document.querySelectorAll('input[name=levelRadio]');
const gameDuration = document.querySelector('input[name=durationInput]');
const gameSound = document.querySelector('input[name=soundSwitch]');
const settingsForm = document.querySelector('.form[name=settingsForm]');
const saveBtn = document.querySelector('button[name=saveSettings]');

// records screen
const levelBtns = document.querySelectorAll('.tab-links__element');
const levelScoreBoards = document.querySelectorAll('.tab-content__element');
const levelEasyTable = document.querySelector('.tab-content__element[name=levelEasyTable]');
const levelNormalTable = document.querySelector('.tab-content__element[name=levelNormalTable]');
const levelHardTable = document.querySelector('.tab-content__element[name=levelHardTable]');

// game 
const holes = document.querySelectorAll('.grid__col--image');
const moles = document.querySelectorAll('.grid__item');

// sounds
const audio = document.querySelector(`audio[data-key='bang']`);

// alerts
const gameOverBox = document.querySelector('.box-ask[name=gameOver]');
const savedDataBox = document.querySelector('.box-alert[name=savedData]');

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
    gameOverBox.classList.add('box-ask--hidden');
    showMole(levels[moleSettings.level].min, levels[moleSettings.level].max);
    gameTimeout = setTimeout(() => {
        gameOver = true;
        if (points > 0) {
            saveResult(gameResults, moleSettings.userName, moleSettings.level, moleSettings.duration, points);
        }
        boxAskResult.textContent = `You scored ${points} points.`;
        gameOverBox.classList.remove('box-ask--hidden');
    }, moleSettings.duration * 1000);
}

function hit(e) {
    if (!e.isTrusted)
        return;
    this.classList.add('grid__item--hidden');
    if (moleSettings.sound) {
        audio.currentTime = 0;
        audio.play();
    }
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
    gameOverBox.classList.add('box-ask--hidden');
    scoreBoard.classList.add('grid--hidden');
}

function saveResult(gameResults, userName, level, duration, points) {
    gameResults.push({
        playerName: userName,
        level: level,
        duration: duration,
        points: points,
        rating: Math.round((((100 / duration) * points) + Number.EPSILON) * 100) / 100
    });
    const easyResults = filterResults(gameResults, '0', 'rating', 100);
    const mediumResults = filterResults(gameResults, '1', 'rating', 100);
    const hardResults = filterResults(gameResults, '2', 'rating', 100);
    gameResults = easyResults.concat(mediumResults, hardResults);

    localStorage.setItem('molePoints', JSON.stringify(gameResults));
}

function showSettings() {
    mainMenu.classList.add('grid--hidden');
    settings.classList.remove('grid--hidden');
    backBtn.classList.remove('header__btn--hidden');
}

function getLocalStorageData() {
    userName.value = moleSettings.userName;
    gameLevel[moleSettings.level].checked = true;
    gameDuration.value = moleSettings.duration;
    updateOutputForDuration();
    gameSound.checked = moleSettings.sound;
    updateOutputForSound();
}

function saveSettings() {
    moleSettings = {
        userName: userName.value.toUpperCase(),
        level: document.querySelector('input[name=levelRadio]:checked').dataset.key,
        duration: gameDuration.value,
        sound: gameSound.checked
    };
    localStorage.setItem('moleSettings', JSON.stringify(moleSettings));
    savedDataBox.classList.remove('box-alert--hidden');
    setTimeout(() => {
        savedDataBox.classList.add('box-alert--hidden');
    }, 1000);
}

function showGameBoard() {
    updateTableContents(levelEasyTable, gameResults, '0');
    updateTableContents(levelNormalTable, gameResults, '1');
    updateTableContents(levelHardTable, gameResults, '2');

    mainMenu.classList.add('grid--hidden');
    backBtn.classList.remove('header__btn--hidden');
    scoreBoard.classList.remove('grid--hidden');
}

function updateTableContents(element, results, level) {
    records = filterResults(results, level, 'rating', 100);
    let lp = 0;
    let table;
    if (records.length > 0) {
        table =
            '<table class="table">' +
            '<tr class="table__tr">' +
            '<th class="table__th">Lp.</th>' +
            '<th class="table__th">Player name</th>' +
            '<th class="table__th">Time</th>' +
            '<th class="table__th">Points</th>' +
            '<th class="table__th">Rating</th>' +
            '</tr>';
        records.forEach(record => {
            table +=
                '<tr class="table__tr">' +
                `<td class="table__td table__td--right">${++lp}</td>` +
                `<td class="table__td">${record.playerName}</td>` +
                `<td class="table__td table__td--right">${record.duration} s</td>` +
                `<td class="table__td table__td--right">${record.points}</td>` +
                `<td class="table__td table__td--right">${record.rating}</td>` +
                '</tr>';
        });
        table +=
            '</table>';
    } else {
        table =
            '<table class="table">' +
            '<tr class="table__tr">' +
            '<td class="table__td table__td--center">No records!</td>' +
            '</tr>' +
            '</table>';
    }

    element.innerHTML = table;
}

function openTab(e) {
    const id = e.currentTarget.dataset.id;
    levelScoreBoards.forEach((table, idx) => {
        (id == idx) ?
        table.classList.remove('tab-content__element--hidden'): table.classList.add('tab-content__element--hidden');
    });
    levelBtns.forEach((btn, idx) => {
        (id == idx) ?
        btn.classList.add('tab-links__element--active'): btn.classList.remove('tab-links__element--active');
    });

}

function filterResults(records, level, sort, limit) {
    return records
        .filter(record => record.level === level)
        .sort((a, b) => b[sort] - a[sort])
        .slice(0, limit);
}

function updateOutputForDuration() {
    durationOutput.value = `${durationInput.value}s`;
}

function updateOutputForSound() {
    soundOutput.value = soundSwitch.checked ? 'on' : 'off';
}

getLocalStorageData();

playBtn.addEventListener('click', startGame);
settingsBtn.addEventListener('click', showSettings);
recordsBtn.addEventListener('click', showGameBoard);

backBtn.addEventListener('click', showMainMenu);
userName.addEventListener('change', saveSettings);
gameDuration.addEventListener('input', updateOutputForDuration);
gameSound.addEventListener('change', updateOutputForSound);
settingsForm.addEventListener('submit', e => e.preventDefault());
saveBtn.addEventListener('click', saveSettings);
moles.forEach(mole => mole.addEventListener('click', hit));

playAgainBtn.addEventListener('click', startGame);
mainMenuBtn.addEventListener('click', showMainMenu);

levelBtns.forEach(levelBtn => levelBtn.addEventListener('click', e => openTab(e)));