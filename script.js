var timerTime;

document.addEventListener('DOMContentLoaded', function() {
    var difficultyButtons = document.querySelectorAll('.difficulty-button');
    difficultyButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var difficulty;
            if (this.classList.contains('easy')) {
                timerTime = 190;
                difficulty = 'Easy';
            } else if (this.classList.contains('medium')) {
                timerTime = 90;
                difficulty = 'Medium';
            } else if (this.classList.contains('hard')) {
                timerTime = 60;
                difficulty = 'Hard';
            }
            localStorage.setItem('timerTime', timerTime);
            localStorage.setItem('difficulty', difficulty); 
            showPlayerNameInput();
        });
    });

    document.getElementById('show-ranking').addEventListener('click', function() {
        var rankingContainer = document.getElementById('ranking-container');
        var rankingList = document.getElementById('ranking-list');
    
        rankingList.innerHTML = ''; 
        var results = JSON.parse(localStorage.getItem('results')) || [];
    
        sortResults(results);
    
        results.forEach(function(result) {
            var entry = document.createElement('div');
            entry.textContent = `${result.playerName} - ${result.difficulty}`;
            rankingList.appendChild(entry);
        });
    
        rankingContainer.style.display = 'block';
    });
    
    function sortResults(results) {
        results.sort(function(a, b) {
            var difficultyOrder = { 'Hard': 1, 'Medium': 2, 'Easy': 3 };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        });
    }
    
    

    document.getElementById('close-ranking').addEventListener('click', function() {
        var rankingContainer = document.getElementById('ranking-container');
        var content = document.querySelector('.content'); 
    
        rankingContainer.style.display = 'none';
        content.style.display = 'block';
    });


    document.getElementById('reset-ranking').addEventListener('click', clearRanking);
    
});


function startGame() {
    document.querySelector('.game-title').style.display = 'none';
    document.querySelector('.button-container').style.display = 'none';
    document.querySelector('.difficulty-container').style.display = 'block';
}

function showPlayerNameInput() {
    document.querySelector('.difficulty-container').style.display = 'none';
    document.querySelector('.player-name-container').style.display = 'block';
}

function confirmName() {
    var playerNameInput = document.querySelector('.player-name-input');
    var playerName = playerNameInput.value; 

    if(playerName) { 
        localStorage.setItem('playerName', playerName);
        window.location.href = 'game/game.html'; 
    } else {
        alert('Пожалуйста, введите имя игрока.');
    }
}


function clearRanking() {
    localStorage.removeItem('results');

    var rankingList = document.getElementById('ranking-list');
    if (rankingList) {
        rankingList.innerHTML = ''; 
    }
}


let themeCounter = localStorage.getItem('themeCounter') ? parseInt(localStorage.getItem('themeCounter')) : 0;

document.getElementById('colorado').addEventListener('click', function() {
    themeCounter = (themeCounter + 1) % 5;
    localStorage.setItem('themeCounter', themeCounter); 
    updateTheme();
});

function updateTheme() {
    document.body.className = ''; 
    if (themeCounter === 1) {
        document.body.classList.add('green-theme');
    } else if (themeCounter === 2) {
        document.body.classList.add('brown-theme');
    } else if (themeCounter === 3) {
        document.body.classList.add('blue-theme');
    } else if (themeCounter === 4) {
        document.body.classList.add('pink-theme');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    themeCounter = localStorage.getItem('themeCounter') ? parseInt(localStorage.getItem('themeCounter')) : 0;
    updateTheme();
});
