var field = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var humanPlayer = 'x';
var anotherPlayer = 'o';
var aiPlayer = 'o';
var difficult = 0;
var spot = 1;
var gameMode = 'pve';

window.onload = function () {
    toogleActiveButton('cross-player');
    toogleActiveButton('dif-min');
    toogleActiveButton('gamemode-pve');

    for (let i = 0; i < 9; i++) {
        document.getElementById('cell-' + i).addEventListener('click', function () {
            if (gameMode == 'pvp') {
                if (spot % 2 != 0) {
                    let returnValue = humanMove(i, humanPlayer);

                    if (returnValue == -1) {
                        return -1;
                    }

                    return 0;
                } else {
                    let returnValue = humanMove(i, anotherPlayer);

                    if (returnValue == -1) {
                        return -1;
                    }

                    return 0;
                }
            } else if (gameMode == 'pve') {
                let returnValue = humanMove(i, humanPlayer);

                if (returnValue == -1) {
                    return -1;
                }

                aiMove();

                return 0;
            }
        });
    }

    document.getElementById('new-game').onclick = function () {
        startNewGame();
    };

    document.getElementById('cross-player').onclick = function () {
        humanPlayer = 'x';
        aiPlayer = 'o';
        anotherPlayer = aiPlayer;
        startNewGame();

        toogleActiveButton('null-player');
        toogleActiveButton('cross-player');
    };

    document.getElementById('null-player').onclick = function () {
        humanPlayer = 'o';
        aiPlayer = 'x';
        anotherPlayer = aiPlayer;
        startNewGame();

        toogleActiveButton('null-player');
        toogleActiveButton('cross-player');
    };

    document.getElementById('dif-min').onclick = function () {
        difficult = 0;
        startNewGame();

        toogleActiveButton('dif-min');
        toogleActiveButton('dif-max');
    };

    document.getElementById('dif-max').onclick = function () {
        difficult = 1;
        startNewGame();

        toogleActiveButton('dif-max');
        toogleActiveButton('dif-min');
    };

    document.getElementById('gamemode-pve').onclick = function () {
        gameMode = 'pve';
        startNewGame();

        toogleActiveButton('gamemode-pve');
        toogleActiveButton('gamemode-pvp');
    };

    document.getElementById('gamemode-pvp').onclick = function () {
        gameMode = 'pvp';
        startNewGame();

        toogleActiveButton('gamemode-pve');
        toogleActiveButton('gamemode-pvp');
    };

};

function toogleActiveButton(id) {
    var element = document.getElementById(id);
    element.classList.toggle('active');
}

function humanMove(index, player) {
    let humanMoveIndex = index;
    if (!isFreeCell(humanMoveIndex)) {
        return -1;
    }

    field[humanMoveIndex] = player;
    spot++;
    updateScreen();

    if (isWin(field, player)) {
        alert('Игра окончена! ' + player + ' оказался смекалистее. Ну что? Два из трех? Или шесть из десяти? Продолжаем!');
        startNewGame();
        return 1;
    }

    return 0;
}

function aiMove() {
    if (isWin(field, humanPlayer)) {
        alert('Ты победил! ' + humanPlayer + ', ты победил! Может у человечества еще есть будущее?');
        startNewGame();
        return 1;
    }

    let aiMoveIndex;
    switch (difficult) {
        case 0:
            aiMoveIndex = getRandomMove(field);
            break;
        case 1:
            aiMoveIndex = getBestMove(field, aiPlayer).index;
            break;

        default:
            return -5;
    }

    field[aiMoveIndex] = aiPlayer;
    spot++;
    updateScreen();

    if (isWin(field, aiPlayer)) {
        alert('Game Over. ' + aiPlayer + ' победил, а восстание машин не за горами. Начни новую игру и попробуй его остановить');
        startNewGame();
        return 2;
    } else if(isTie(field)) {
        alert('Ничья... Да как так то? Ну попробуй еще раз ');
        startNewGame();
        return 3;
    }

    return 0;
}


function isTie(field) {
    if(emptyCells(field) == 0) {
        return true;
    } else {
        return false;
    }
}

function startNewGame() {
    field = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    spot = 1;
    updateScreen(field);
}

function updateScreen() {
    for (let i = 0; i < 9; i++) {
        var cell = field[i];
        if (cell == 'x') {
            document.getElementById('cell-' + i).innerHTML = '<i class="fas fa-times"></i>';
        } else if (cell == 'o') {
            document.getElementById('cell-' + i).innerHTML = '<i class="far fa-circle"></i>';
        } else {
            document.getElementById('cell-' + i).innerHTML = '';
        }
    }
}

function isWin(field, player) {
    if ((field[0] == player && field[1] == player && field[2] == player) ||
        (field[3] == player && field[4] == player && field[5] == player) ||
        (field[6] == player && field[7] == player && field[8] == player) ||
        (field[0] == player && field[3] == player && field[6] == player) ||
        (field[1] == player && field[4] == player && field[7] == player) ||
        (field[2] == player && field[5] == player && field[8] == player) ||
        (field[0] == player && field[4] == player && field[8] == player) ||
        (field[2] == player && field[4] == player && field[6] == player)) {
        return true;
    } else {
        return false;
    }
}

function emptyCells(field) {
    return field.filter(cell => cell != 'o' && cell != 'x');
}

function isFreeCell(index) {
    let freeCells = emptyCells(field);
    if (freeCells.indexOf(index) != -1) {
        return true;
    } else {
        return false;
    }
}

function getBestMove(newField, player) {
    let availableSpots = emptyCells(newField);

    if (isWin(newField, humanPlayer)) {
        return {
            score: -10
        };
    } else if (isWin(newField, aiPlayer)) {
        return {
            score: 10
        };
    } else if (availableSpots.length === 0) {
        return {
            score: 0
        };
    }

    var moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
        var move = {};
        move.index = newField[availableSpots[i]];
        newField[availableSpots[i]] = player;

        if (player == aiPlayer) {
            let result = getBestMove(newField, humanPlayer);
            move.score = result.score;
        } else {
            let result = getBestMove(newField, aiPlayer);
            move.score = result.score;
        }

        newField[availableSpots[i]] = move.index;
        moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;

        for (let i = 0; i < moves.length; i++) {
            if (bestScore < moves[i].score) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;

        for (let i = 0; i < moves.length; i++) {
            if (bestScore > moves[i].score) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function getRandomMove(newField) {
    let availableSpots = emptyCells(newField);
    let randomSpot = availableSpots[getRandom(availableSpots.length - 1)];

    return randomSpot;
}

function getRandom(max) {
    var min = 0;
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);

    return rand;
}