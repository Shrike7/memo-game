const gameStartBtn = document.querySelector('#gameStart'),
    levelLabel = document.querySelector('#levelLabel'),
    menuBtn = document.querySelector('#menu'),
    gameRestartBtn = document.querySelector('#gameRestart'),
    field = document.querySelector('#field'),
    difficultyLevels = 'hard';

let cellGroup = new Array;

let levelPath = [],
    level = 1,
    levelMemoAmount = 2,
    levelMemoAmountSleep = 1, //while levelMemoAmountSleep < x levelMemoAmount doesn't increase
    timeToMemo,
    fieldSize;

const gameControl = {
    gameStart() {
        gameStartBtn.style.display = 'none';
        levelLabel.style.display = 'block';
    
        levelControl.generateLevelPath();
        setTimeout(() => levelControl.startLevel(), 500);
    },
    gameRestart() {
        menuBtn.style.display = 'none';
        gameRestartBtn.style.display = 'none';
    
        gameControl.gameReset();
        levelControl.generateLevelPath();
        setTimeout(() => levelControl.startLevel(), 500);
    },
    userPlay(e) {
        let userCell = e.target;
        let userCellPossition = +userCell.getAttribute('data-position');

        //is user right
        if (levelPath.includes(userCellPossition) || userCell.classList.contains('active')) {
            userCell.classList.add('active');
    
            let index = levelPath.indexOf(userCellPossition);
            if (index !== -1) levelPath.splice(index, 1);
    
            //is all right
            if (levelPath.length == 0) {
                cellGroup.forEach(cellElem => cellElem.removeEventListener('click', gameControl.userPlay));
                setTimeout(() => levelControl.nextLevel(), 1000);
            }
        } else {
            userCell.classList.add('wrong');
            gameControl.gameOver();
        }
    },
    gameOver() {
        cellGroup.forEach(cellElem => cellElem.removeEventListener('click', this.userPlay));
    
        levelPath.forEach(cellPosition => {
            const cellElem = cellGroup[cellPosition];
            cellElem.classList.add('active');
        });
    
        setTimeout(() => {
            menuBtn.style.display = 'block';
            gameRestartBtn.style.display = 'block';
        }, 500);
    },
    gameReset() {
        //Reset
        levelPath = [];
        level = 1;
        levelMemoAmount = 2;
        levelMemoAmountSleep = 1;
        globalControl.difficultyControl();
    
        //Reset field
        cellGroup.forEach(cellElem => {
            cellElem.classList.remove('active');
            cellElem.classList.remove('wrong');
        });
    
        //Reset label
        levelLabel.textContent = level + ' level';
    
        createField(fieldSize);
    },
    backToMenu() {
        gameControl.gameReset();
    
        menuBtn.style.display = 'none';
        gameRestartBtn.style.display = 'none';
        levelLabel.style.display = 'none';
        gameStartBtn.style.display = 'block';
    },
}

const levelControl = {
    generateLevelPath() {
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
                this.generateLevelPath();
            } else {
                levelMemoAmount--;
            }
        }
    },
    startLevel() {
        levelPath.forEach(cellPosition => {
            const cellElem = cellGroup[cellPosition];
            cellElem.classList.add('active');
        });
    
        setTimeout(() => {
            levelPath.forEach(cellPosition => {
                const cellElem = cellGroup[cellPosition];
                cellElem.classList.remove('active');
            });
    
            cellGroup.forEach(cellElem => cellElem.addEventListener('click', gameControl.userPlay));
        }, timeToMemo);
    },
    nextLevel() {
        level++;
        levelLabel.textContent = level + ' level';
    
        cellGroup.forEach(cellElem => {
            cellElem.classList.remove('active');
        });
    
        this.generateLevelPath();
        this.startLevel();
    },
}

const globalControl = {
    difficultyControl() {
        switch (difficultyLevels) {
            case 'easy':
                fieldSize = 3;
                timeToMemo = 4000;
                break;
            case 'normal':
                fieldSize = 4;
                timeToMemo = 3000;
                break;
            case 'hard':
                fieldSize = 5;
                timeToMemo = 2000;
                break;
            default:
                fieldSize = 3;
                timeToMemo = 4000;
                break;
        }
    }
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


function init () {
    globalControl.difficultyControl();
    createField(fieldSize);
    gameStartBtn.addEventListener('click', gameControl.gameStart);
    gameRestartBtn.addEventListener('click', gameControl.gameRestart)
    menuBtn.addEventListener('click', gameControl.backToMenu);
}

document.addEventListener('DOMContentLoaded', init);