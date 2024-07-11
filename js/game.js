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

    /* Функция окрашивает игровое поле */
    function randomColor(){
        let hue = Math.floor(Math.random() * 15) + 30;
        let color = "hsl(" + hue + ", 100%, 75%)";
        return color;
    }
    
    /* Выбор чем ходить: крестиком или ноликом */
    function changeCharactersOnTheBoard() {
        const buttonCrossOrCircle = document.querySelector('.button-cross-or-circle');

        firstPlayer = (buttonCrossOrCircle.classList.contains('circle')) ? 'url("img/circle.png")' : 'url("img/cross.png")';
        secondPlayer = (buttonCrossOrCircle.classList.contains('circle')) ? 'url("img/cross.png")' : 'url("img/circle.png")';
        
        document.querySelectorAll('.innerCell').forEach((cell) => {
            if (cell.style.backgroundImage === secondPlayer) cell.style.backgroundImage = firstPlayer;
            else if (cell.style.backgroundImage === firstPlayer) cell.style.backgroundImage = secondPlayer;
        });
    }

    /* Ход игрока */ 
    let availableMainCellToMove = null;

    function makeAMove() {
        const availableMainCells = document.querySelectorAll('.mainCell');
        const targetInnerCells = event.target.closest('table').querySelectorAll('.innerCell');

        //Делаем ход
        if (event.target.className === "innerCell" && event.target.style.backgroundImage === "") {  
            //Проверяем пустое ли поле 
            const checkIfBoardIsNotEmpty = Array.from(document.querySelectorAll('.innerCell')).some((cell) => cell.style.backgroundImage !== "");
            if (checkIfBoardIsNotEmpty) {
                if (event.target.closest('.mainCell') === availableMainCellToMove) {
                    event.target.style.backgroundImage = firstPlayer;
                    availableMainCellToMove.style.boxShadow = 'none';
                } else return null;
            } else event.target.style.backgroundImage = firstPlayer;
            
            checkIfWin(); //Проверяем победил ли кто-то

            //Теперь ходит бот
            setTimeout (() => {
                makeBotMove(availableMainCellToMove);
            }, 400); 
        } 

        //Перемещаем availableMainCellToMove
        // Для этого проходимся по всем ячейкам дочернего поля до ячейки, на которую нажали
        for (let i = 0; i < targetInnerCells.length; i++) {
            // если дошли до нужной ячейки
            if (targetInnerCells[i] === event.target) {
                // то проходимся по всем ячейкам основного поля
                for (let j = 0; j < availableMainCells.length; j++) {
                    // если нашли ячейку с тем же индексом, то ограничиваем ход ею
                    if (j === i) {
                        availableMainCellToMove = availableMainCells[j];
                        availableMainCells[j].style.boxShadow = '0 0 5px 5px #ff719e';
                    } else {
                        availableMainCells[j].style.boxShadow = 'none';
                    }
                }
            }
        }
    }

    /* Ход бота */
    function makeBotMove(availableMainCellToMove) {
        const emptyCells = Array.from(availableMainCellToMove.querySelectorAll('.innerCell')).filter((cell) => cell.style.backgroundImage === "");
        
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const botCell = emptyCells[randomIndex];
            botCell.style.backgroundImage = secondPlayer;
        }
    }

    /* Победа */
    function checkIfWin() {
    }

    document.addEventListener('DOMContentLoaded', () => {

        //Поле помещаем сразу при загрузке страницы
        createGameBoard();

        //При нажатии на ячейку будет сделан ход
        const board = document.querySelector('.board');
        board.addEventListener('click', (event) => {
            event.preventDefault();
            makeAMove();
        });

        const buttonCrossOrCircle = document.querySelector('.button-cross-or-circle');
        buttonCrossOrCircle.addEventListener('click', () => {
            buttonCrossOrCircle.classList.toggle('circle');
            changeCharactersOnTheBoard();
        });
    });
}) ()