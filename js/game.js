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
    
    /* Смена игрока */
    let playerNumber = 3;

    function changeCharacter() {
        const crossOrCircle = document.querySelector('.cross-or-circle');

        //Меняем наверху тоже
        crossOrCircle.classList.toggle('circle');

        //Переключаем игрока
        playerNumber++; 
    }

    /* Ход игрока */ 
    let availableMainCellToMove = null;
    
    // Перемещаем availableMainCellToMove
    function changeavailableMainCellToMovePosition() {
        const availableMainCells = document.querySelectorAll('.mainCell');
        const targetInnerCells = event.target.closest('table').querySelectorAll('.innerCell');

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
    
    //Делаем ход
    function makeAMove() {
        if (event.target.className === "innerCell" && event.target.style.backgroundImage === "") {  
            changeCharacter();
            //Проверяем пустое ли поле 
            const checkIfBoardIsNotEmpty = Array.from(document.querySelectorAll('.innerCell')).some((cell) => cell.style.backgroundImage !== "");
            if (checkIfBoardIsNotEmpty) {
                if (event.target.closest('.mainCell') === availableMainCellToMove) {
                    event.target.style.backgroundImage = (playerNumber % 2 === 0) ? firstPlayer : secondPlayer;
                    availableMainCellToMove.style.boxShadow = 'none';
                } else return null;
            } else event.target.style.backgroundImage = firstPlayer;
            
            checkIfWin(); //Проверяем победил ли кто-то
        } 
        changeavailableMainCellToMovePosition();
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
    });
}) ()