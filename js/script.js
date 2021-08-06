const gameStartBtn = document.querySelector('#gameStart'),
    levelLabel = document.querySelector('#levelLabel'),
    menuBtn = document.querySelector('#menu'),
    gameRestartBtn = document.querySelector('#gameRestart'),
    field = document.querySelector('#field');
    cellGroup = new Array;

let levelPath = [],
    level = 1,
    levelMemoAmount = 2,
    levelMemoAmountSleep = 1, //while levelMemoAmountSleep < x levelMemoAmount doesn't increase
    fieldSize = 3;

function gameStart () {
    gameStartBtn.style.display = 'none';
    levelLabel.style.display = 'block';

    generateLevelPath();
    setTimeout(() => startLevel(), 500);
}

function gameRestart () {
    menuBtn.style.display = 'none';
    gameRestartBtn.style.display = 'none';

    gameReset();
    generateLevelPath();
    setTimeout(() => startLevel(), 500);
}

function gameReset () {
    //Reset
    levelPath = [];
    level = 1;
    levelMemoAmount = 2;
    levelMemoAmountSleep = 1;
    fieldSize = 3;

    //Reset field
    cellGroup.forEach(cellElem => {
        cellElem.classList.remove('active');
        cellElem.classList.remove('wrong');
    });

    //Reset label
    levelLabel.textContent = level + ' level';

    createField(fieldSize);
}

function backToMenu () {
    gameReset();

    menuBtn.style.display = 'none';
    gameRestartBtn.style.display = 'none';
    levelLabel.style.display = 'none';
    gameStartBtn.style.display = 'block';
}

function createField (fieldSize) {
    const cellAmount = fieldSize * fieldSize;
    field.innerHTML = '';
    document.documentElement.style.setProperty('--fieldSize', fieldSize);

    for (let i = 0; i < cellAmount; i++) {
        let cell = document.createElement('div');
        field.appendChild(cell);
        cell.classList.add('cell');
        cell.setAttribute('data-position', i);
    }
    cellGroup = document.querySelectorAll('#field .cell');
}

function generateLevelPath () {
    if (levelMemoAmountSleep < 3) levelMemoAmountSleep++;
        else {
            levelMemoAmountSleep = 1;
            levelMemoAmount++;
        }


    for (let i = 0; i < levelMemoAmount; i++) {
        let isCellEmpty = false,
            randomCell;

        //anti same cell system
        while (isCellEmpty == false) {
            randomCell = Math.ceil(Math.random() * cellGroup.length) - 1;
            if (!levelPath.includes(randomCell)) isCellEmpty = true;
        }

        levelPath.push(randomCell);
    }
    
    if (levelPath.length == Math.floor(cellGroup.length / 2.5)) {
         // more than 7 size too big for field 
        if (fieldSize !== 7) {
            levelPath = [];
            levelMemoAmount = 2;

            createField(++fieldSize);
            generateLevelPath();
        } else {
            levelMemoAmount--;
        }
    }
}

function startLevel () {
    levelPath.forEach(cellPosition => {
        const cellElem = cellGroup[cellPosition];
        cellElem.classList.add('active');
    });

    setTimeout(() => {
        levelPath.forEach(cellPosition => {
            const cellElem = cellGroup[cellPosition];
            cellElem.classList.remove('active');
        });

        cellGroup.forEach(cellElem => cellElem.addEventListener('click', userPlay));
    }, 4000);
}

function userPlay (e) {
    let userCell = e.target;
    let userCellPossition = +userCell.getAttribute('data-position');

    //is user right
    if (levelPath.includes(userCellPossition) || userCell.classList.contains('active')) {
        userCell.classList.add('active');

        let index = levelPath.indexOf(userCellPossition);
        if (index !== -1) levelPath.splice(index, 1);

        //is all right
        if (levelPath.length == 0) {
            cellGroup.forEach(cellElem => cellElem.removeEventListener('click', userPlay));
            setTimeout(() => nextLevel(), 1000);
        }
    } else {
        userCell.classList.add('wrong');
        gameOver();
    }
}

function nextLevel () {
    level++;
    levelLabel.textContent = level + ' level';

    cellGroup.forEach(cellElem => {
        cellElem.classList.remove('active');
    });

    generateLevelPath();
    startLevel();
}

function gameOver () {
    cellGroup.forEach(cellElem => cellElem.removeEventListener('click', userPlay));

    levelPath.forEach(cellPosition => {
        const cellElem = cellGroup[cellPosition];
        cellElem.classList.add('active');
    });

    setTimeout(() => {
        menuBtn.style.display = 'block';
        gameRestartBtn.style.display = 'block';
    }, 500);
}

createField(fieldSize);
gameStartBtn.addEventListener('click', gameStart);
gameRestartBtn.addEventListener('click', gameRestart)
menuBtn.addEventListener('click', backToMenu);