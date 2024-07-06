(function () {
    let firstPlayer = 'url("img/cross.png")';
    let secondPlayer = 'url("img/circle.png")';

    function createGameBoard() {
        const sizeOfBoard = sessionStorage.getItem('sizeOfBoard');

        // Формируем основную сетку
        for (let i = 0; i < sizeOfBoard; i++) {
            const rowOfMainBoard = document.createElement('tr');
            rowOfMainBoard.className = 'rowOfMainBoard';
            for (let j = 0; j < sizeOfBoard; j++) {
                const mainCell = document.createElement('td');
                mainCell.className = "mainCell";

                // А теперь сетку внутри каждой ячейки основной сетки
                const innerBoard = document.createElement('table');
                innerBoard.className = 'innerBoard';
                for (let k = 0; k < sizeOfBoard; k++) {
                    const rowOfInnerBoard = document.createElement('tr');
                    rowOfInnerBoard.className = 'rowOfInnerBoard';
                    for (let m = 0; m < sizeOfBoard; m++) {
                        const innerCell = document.createElement('td');
                        innerCell.className = "innerCell";
                        innerCell.style.backgroundColor = randomColor();
                        rowOfInnerBoard.appendChild(innerCell);     
                    }
                    innerBoard.appendChild(rowOfInnerBoard);
                }
                mainCell.appendChild(innerBoard);
                rowOfMainBoard.appendChild(mainCell);
            };
            document.querySelector('.board').appendChild(rowOfMainBoard);
        }
    }

    //Функция окрашивает игровое поле
    function randomColor(){
        let hue = Math.floor(Math.random() * 15) + 30;
        let color = "hsl(" + hue + ", 100%, 75%)";
        return color;
    }
    
    //Выбор чем ходить: крестиком или ноликом
    function changeCharactersOnTheBoard() {
        const buttonCrossOrCircle = document.querySelector('.button-cross-or-circle');

        firstPlayer = (buttonCrossOrCircle.classList.contains('circle')) ? 'url("img/circle.png")' : 'url("img/cross.png")';
        secondPlayer = (buttonCrossOrCircle.classList.contains('circle')) ? 'url("img/cross.png")' : 'url("img/circle.png")';
        
        document.querySelectorAll('.innerCell').forEach((cell) => {
            if (cell.style.backgroundImage === secondPlayer) cell.style.backgroundImage = firstPlayer;
            else if (cell.style.backgroundImage === firstPlayer) cell.style.backgroundImage = secondPlayer;
        });
    }

    //Ход игрока
    function makeAMove(callback) {
        if(event.target.className === "innerCell" && event.target.style.backgroundImage === "") {
            event.target.style.backgroundImage = firstPlayer;
            //checkIfWin();

            //Теперь ходит бот
            setTimeout (callback, 400);
        } 
    }

    // Ход бота
    function makeBotMove() {
        const innerCells = document.querySelectorAll('.innerCell');
        const emptyCells = Array.from(innerCells).filter((cell) => cell.style.backgroundImage === "");

        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const botCell = emptyCells[randomIndex];
            botCell.style.backgroundImage = secondPlayer;
        }
    }

    //Победа
    /*function checkIfWin() {
        const board = document.querySelector('.board');
        const rowOfMainBoard = board.querySelectorAll('.rowOfMainBoard');
        const innerBoards = Array.from(rowOfMainBoard).flatMap(row => Array.from(row.querySelectorAll('.innerBoard')));
    
        // Проверяем строки
        for (const innerBoard of innerBoards) {
            const rows = Array.from(innerBoard.querySelectorAll('.rowOfInnerBoard'));
            for (const row of rows) {
                if (Array.from(row.querySelectorAll('.innerCell')).every(cell => cell.style.backgroundImage === firstPlayer)) {
                    alert('Вы победили!');
                    return;
                }
            }
        }
    
        // Проверяем столбцы
        for (let i = 0; i < rowOfMainBoard[0].querySelectorAll('.innerBoard').length; i++) {
            let hasWin = true;
            for (const row of rowOfMainBoard) {
                const cell = row.querySelectorAll('.innerBoard')[i].querySelectorAll('.innerCell')[0];
                if (cell.style.backgroundImage !== firstPlayer) {
                    hasWin = false;
                    break;
                }
            }
            if (hasWin) {
                alert('Вы победили!');
                return;
            }
        }
    
        // Проверяем диагонали
        let hasWin = true;
        for (let i = 0; i < rowOfMainBoard.length; i++) {
            const cell = rowOfMainBoard[i].querySelectorAll('.innerBoard')[i].querySelectorAll('.innerCell')[0];
            if (cell.style.backgroundImage !== firstPlayer) {
                hasWin = false;
                break;
            }
        }
        if (hasWin) {
            alert('Вы победили!');
            return;
        }
    
        hasWin = true;
        for (let i = 0; i < rowOfMainBoard.length; i++) {
            const cell = rowOfMainBoard[i].querySelectorAll('.innerBoard')[rowOfMainBoard.length - 1 - i].querySelectorAll('.innerCell')[0];
            if (cell.style.backgroundImage !== firstPlayer) {
                hasWin = false;
                break;
            }
        }
        if (hasWin) {
            alert('Вы победили!');
            return;
        }
    }*/

    document.addEventListener('DOMContentLoaded', () => {

        //Поле помещаем сразу при загрузке страницы
        createGameBoard();

        //При нажатии на ячейку будет сделан ход
        const board = document.querySelector('.board');
        board.addEventListener('click', (event) => {
            event.preventDefault();
            makeAMove(makeBotMove);
        });

        const buttonCrossOrCircle = document.querySelector('.button-cross-or-circle');
        buttonCrossOrCircle.addEventListener('click', () => {
            buttonCrossOrCircle.classList.toggle('circle');
            changeCharactersOnTheBoard();
        });
    });
}) ()