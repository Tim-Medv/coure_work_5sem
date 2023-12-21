document.addEventListener('DOMContentLoaded', () => {
    generateLevel(levels[currentLevel]);

    var timerTime = localStorage.getItem('timerTime'); 
    if (timerTime) {
        startTimer(parseInt(timerTime), document.querySelector('#timer'));
    } else {
        console.error('время не определено');
    }

    var playerName = localStorage.getItem('playerName'); 
    console.log('Игрок:', playerName);
    if (playerName) {
        document.querySelector('.player-name-display').textContent = 'player ' + playerName;
    }

    const savedTheme = localStorage.getItem('theme') || '';
    updateTheme(savedTheme);    
});

//обработчик событий колб
function attachEventListeners() {
    document.querySelectorAll('.test-tube').forEach(tube => {
        tube.addEventListener('click', function() {
            if (selectedTube) {
                if (selectedTube !== this) {
                    animatePouring(selectedTube, this);
                }
                selectedTube = null;
            } else {
                if (this.querySelector('.liquid')) {
                    selectedTube = this;
                }
            }
        });
    });
}

let selectedTube = null;

function animatePouring(fromTube, toTube) {
    const fromLiquid = fromTube.querySelector('.liquid:last-child');
    const toLiquids = toTube.querySelectorAll('.liquid');

    if (fromLiquid && canPour(fromLiquid, toTube)) {
        const layerHeight = 200 / maxLayers; 

        if (maxLayers === 2) {
            // Логика для 2 слоёв
            fromLiquid.style.height = '0px';

            if (toLiquids.length > 0) {
                toLiquids[0].style.height = '200px';
            } else {
                const newLiquid = document.createElement('div');
                newLiquid.className = fromLiquid.className;
                newLiquid.style.height = '0px';
                toTube.appendChild(newLiquid);
                setTimeout(() => {
                    newLiquid.style.height = '100px';
                }, 20); 
            }
        } else if (maxLayers === 3) {
            // Логика для 3 слоёв
            let currentHeightFrom = parseInt(fromLiquid.style.height);
            let amountToPour = layerHeight;

            
            if (currentHeightFrom > layerHeight / 2) {
                amountToPour = currentHeightFrom;
            }

            let newHeightFrom = currentHeightFrom - amountToPour;
            newHeightFrom = Math.max(newHeightFrom, 0);
            fromLiquid.style.height = newHeightFrom + 'px';

            if (toLiquids.length > 0) {
                let newHeightTo = parseInt(toLiquids[toLiquids.length - 1].style.height) + amountToPour;

                // Округляем до 200px, если значение близко
                if (newHeightTo >= 198) {
                    newHeightTo = 200;
                }

                toLiquids[toLiquids.length - 1].style.height = newHeightTo + 'px';
            } else {
                const newLiquid = document.createElement('div');
                newLiquid.className = fromLiquid.className;
                newLiquid.style.height = '0px';
                toTube.appendChild(newLiquid);
                setTimeout(() => {
                    newLiquid.style.height = amountToPour + 'px';
                }, 20); 
            }
        }

        setTimeout(() => {
            if (parseInt(fromLiquid.style.height) === 0) {
                fromLiquid.remove();
            }
            checkCompletion();
        }, 800);
    }
}







function canPour(fromLiquid, toTube) {
    const toLiquids = toTube.querySelectorAll('.liquid');

    
    if (maxLayers === 2) {
        if (toLiquids.length === 2) {
            return false;
        } else if (toLiquids.length === 1) {
            return fromLiquid.className === toLiquids[0].className;
        }
        return true;
    }

    
    else { 
        let totalHeight = 0;
        toLiquids.forEach(liquid => {totalHeight += parseFloat(liquid.style.height);});

        
        if (totalHeight >= 197) {
            return false;
        }

        else if (toLiquids.length === 3) {
            return false;
        } else if (toLiquids.length === 2) {
            return fromLiquid.className === toLiquids[1].className;
        } else if (toLiquids.length === 1) {
            return fromLiquid.className === toLiquids[0].className; 
        }
        return true; 
    }
}









function checkCompletion() {
    const allTubes = document.querySelectorAll('.test-tube');
    const isCompleted = Array.from(allTubes).every(tube => {
        const liquids = tube.querySelectorAll('.liquid');
        return liquids.length === 0 || (liquids.length === 1 && liquids[0].style.height === '200px');
    });

    if (isCompleted) {
        showCompletionMessage();
    }
}

function showCompletionMessage() {
    const message = document.createElement('div');
    message.textContent = 'Уровень пройден!';
    message.id = 'completion-message';
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
        if (currentLevel < levels.length - 1) {
            generateNextLevel();
        } else {
            saveGameResult();
            showFinalMessage();
        }
    }, 1000);
}


function saveGameResult() {
    const playerName = localStorage.getItem('playerName');
    const difficulty = localStorage.getItem('difficulty');
    const results = JSON.parse(localStorage.getItem('results')) || [];

    results.push({ playerName, difficulty });
    localStorage.setItem('results', JSON.stringify(results));
}


function generateNextLevel() {
    currentLevel++;
    if (currentLevel < levels.length) {
        generateLevel(levels[currentLevel]);
    }
}


function generateLevel(levelConfig) {
    maxLayers = levels[currentLevel].maxLayers; 

    const gameContainer = document.getElementById('game');
    gameContainer.innerHTML = ''; 


    shuffle(levelConfig.config);


    levelConfig.config.forEach((config, index) => {
        const tube = document.createElement('div');
        tube.className = 'test-tube';
        tube.id = `tube${index + 1}`;

        config.forEach(color => {
            const liquid = document.createElement('div');
            liquid.className = `liquid ${color}`;
            liquid.style.height = `${200 / maxLayers}px`; 
            tube.appendChild(liquid);
        });

        gameContainer.appendChild(tube);
    });

    attachEventListeners();
}



function getRandomColor(excludeColors = []) {
    const colors = [
        'turquoise',
        'coral',
        'violet',  
        'orange',  
        'sapphire',
        'emerald',
        'amethyst',
        'salmon',  
        'indigo',
        'gold',
        'jade',
        'crimson',
        'silver'  
    ];
    

    let availableColors = colors.filter(color => !excludeColors.includes(color));

    if (availableColors.length === 0) {
        availableColors = colors;
    }

    const chosenColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    return chosenColor;
}

const levels = [];
let maxLayers; 


// Уровень 1
let colorA = getRandomColor();
let colorB = getRandomColor([colorA]);
levels.push({ config: [[colorA, colorB], [colorB, colorA], []], maxLayers: 2 });

// Уровень 2
colorA = getRandomColor();
colorB = getRandomColor([colorA]);
colorC = getRandomColor([colorA, colorB]);
levels.push({ config: [[colorA, colorB, colorC], [colorC, colorB, colorA], [colorB, colorA, colorC], [], []], maxLayers: 3 });

// Уровень 3
colorA = getRandomColor();
colorB = getRandomColor([colorA]);
colorC = getRandomColor([colorA, colorB]);
colorD = getRandomColor([colorA, colorB, colorC]);
colorE = getRandomColor([colorA, colorB, colorC, colorD]);
colorF = getRandomColor([colorA, colorB, colorC, colorD, colorE]);

levels.push({
    config: [
        [colorA, colorB, colorC], 
        [colorC, colorA, colorD], 
        [colorB, colorE, colorA], 
        [colorD, colorC, colorE], 
        [colorE, colorD, colorB], 
        []                       
    ],
    maxLayers: 3
});


console.log('Массив уровней:', levels);






let currentLevel = 0;


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]];
    }
}



function showFinalMessage() {
    clearInterval(timerInterval); 

    const message = document.createElement('div');
    message.textContent = 'Успешное прохождение';
    message.className = 'game-title'; 

    const backButton = document.createElement('button');
    backButton.textContent = 'Вернуться';
    backButton.className = 'game-button'; 
    backButton.addEventListener('click', () => {
        window.location.href = '../index.html';
    });

    document.body.innerHTML = '';
    document.body.appendChild(message);
    document.body.appendChild(backButton);
}







function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    timerInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}



function gameOver() {
    const message = document.createElement('div');
    message.textContent = 'Время вышло';
    message.className = 'game-end'; 

    const backButton = document.createElement('button');
    backButton.textContent = 'Вернуться';
    backButton.classList.add('game-button', 'red'); 
    backButton.addEventListener('click', () => {
        window.location.href = '../index.html';
    });

    document.body.innerHTML = '';
    document.body.appendChild(message);
    document.body.appendChild(backButton);
}





function updateTheme() {
    let themeCounter = localStorage.getItem('themeCounter') ? parseInt(localStorage.getItem('themeCounter')) : 0;
    const themeClasses = ['', 'green-theme', 'brown-theme', 'blue-theme', 'pink-theme'];
    document.body.className = themeClasses[themeCounter];
}
