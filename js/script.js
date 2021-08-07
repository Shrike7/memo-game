const menuBody = document.querySelector('#menuBody'),
    mainMenu = document.querySelector('#mainMenu'),
    backFromSettingsBtn = document.querySelector('#backFromSettings'),
    gameStartBtn = document.querySelector('#gameStart'),
    difficultySettingsBtn = document.querySelector('#difficultySettingsBtn'),
    difficultySettings = document.querySelector('#difficultySettings'),
    difficultySettingsBtnGroup = document.querySelector('#difficultySettingsBtnGroup'),
    gameBody = document.querySelector('#gameBody'),
    field = document.querySelector('#field'),
    levelLabel = document.querySelector('#levelLabel'),
    backToMenuBtn = document.querySelector('#backToMenu'),
    gameRestartBtn = document.querySelector('#gameRestart');
    
let cellGroup = new Array;

let levelPath = [],
    level = 1,
    levelMemoAmount = 2,
    levelMemoAmountSleep = 1, //while levelMemoAmountSleep < x levelMemoAmount doesn't increase
    timeToMemo,
    fieldSize,
    difficultyLevel;
    

const gameControl = {
    createField (fieldSize) {
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
    },
    gameRestart() {
        backToMenuBtn.style.display = 'none';
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
            backToMenuBtn.style.display = 'block';
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
    
        gameControl.createField(fieldSize);
    },
    backToMenu() {
        gameControl.gameReset();
    
        backToMenuBtn.style.display = 'none';
        gameRestartBtn.style.display = 'none';

        gameBody.style.display = 'none';
        menuBody.style.display = 'flex'; //display 'flex' !important
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
    
                gameControl.createField(++fieldSize);
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

const menuControl = {
    gameStart() {
        menuBody.style.display = 'none';
        gameBody.style.display = 'flex'; // display 'flex' !important

        globalControl.difficultyControl();
        gameControl.createField(fieldSize);
        levelControl.generateLevelPath();
        setTimeout(() => levelControl.startLevel(), 500);
    },
    backFromSettings() {
        difficultySettings.style.display = 'none';
        mainMenu.style.display = 'block';
    },
    difficultySettings() {
        mainMenu.style.display = 'none';
        difficultySettings.style.display = 'block';
    },
    setDifficulty(e) {
        let elem = e.target;
        let elemDifficultyLevel = elem.dataset['difficult'];
        
        if(!elemDifficultyLevel)  return;
        let previousDifficultyElem = difficultySettingsBtnGroup.querySelector('.active');

        difficultyLevel = elemDifficultyLevel;
        localStorage.setItem('difficultyLevel', difficultyLevel);

        previousDifficultyElem.classList.remove('active');
        elem.classList.add('active');
    },
}

const globalControl = {
    checkDifficulty() {
        difficultyLevel = localStorage.getItem('difficultyLevel');

        if (!difficultyLevel) difficultyLevel = 'easy';
        let elemDifficultyLevel = difficultySettingsBtnGroup.querySelector(`[data-difficult="${difficultyLevel}"]`);
        
        elemDifficultyLevel.classList.add('active');
    },
    difficultyControl() {
        switch (difficultyLevel) {
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


function init () {
    globalControl.checkDifficulty();
    gameStartBtn.addEventListener('click', menuControl.gameStart);
    gameRestartBtn.addEventListener('click', gameControl.gameRestart)
    backToMenuBtn.addEventListener('click', gameControl.backToMenu);
    backFromSettingsBtn.addEventListener('click', menuControl.backFromSettings);
    difficultySettingsBtn.addEventListener('click', menuControl.difficultySettings)
    difficultySettingsBtnGroup.addEventListener('click', menuControl.setDifficulty);
}

document.addEventListener('DOMContentLoaded', init);