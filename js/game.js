(function () {
    let firstPlayer = 'url("img/cross.png")';
    let secondPlayer = 'url("img/circle.png")';

    function createGameBoard() {
        const sizeOfBoard = sessionStorage.getItem('sizeOfBoard');

        // Формируем основную сетку
        for (let rowOfMainBoardIndex = 0; rowOfMainBoardIndex < sizeOfBoard; rowOfMainBoardIndex++) {
            const rowOfMainBoard = document.createElement('tr');
            rowOfMainBoard.className = 'rowOfMainBoard';
            //Создаем ячейки основной сетки
            for (let mainCellIndex = 0; mainCellIndex < sizeOfBoard; mainCellIndex++) {
                const mainCell = document.createElement('td');
                mainCell.className = "mainCell";

                // А теперь формируем дочернюю сетку внутри каждой ячейки основной сетки
                const innerBoard = document.createElement('table');
                innerBoard.className = 'innerBoard';
                //её ряды
                for (let rowOfInnerBoardIndex = 0; rowOfInnerBoardIndex < sizeOfBoard; rowOfInnerBoardIndex++) {
                    const rowOfInnerBoard = document.createElement('tr');
                    rowOfInnerBoard.className = 'rowOfInnerBoard';
                    //и ячейки
                    for (let innerCellIndex = 0; innerCellIndex < sizeOfBoard; innerCellIndex++) {
                        const innerCell = document.createElement('td');
                        innerCell.className = "innerCell";
                        //добавляем ячейкам цвет фона
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
    let playerNumber = 1;
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
            //Проверяем пустое ли поле 
            const checkIfBoardIsNotEmpty = Array.from(document.querySelectorAll('.innerCell')).some((cell) => cell.style.backgroundImage !== "");
            if (checkIfBoardIsNotEmpty) {
                if (event.target.closest('.mainCell') === availableMainCellToMove) {
                    changeCharacter();
                    event.target.style.backgroundImage = (playerNumber % 2 === 0) ? firstPlayer : secondPlayer;
                    availableMainCellToMove.style.boxShadow = 'none';
                } else return null;
            } else {
                event.target.style.backgroundImage = firstPlayer;
                changeCharacter();
            }
            
            checkIfWin(); //Проверяем победил ли кто-то
        } 
        changeavailableMainCellToMovePosition();
    }

    /* Победа */
    function checkIfWin() {
        const popupIfPlayerWin = document.querySelector('.popup');
        const rows = checkIfWinRows();
        const columns = checkIfWinColumn();
        checkIfWinDiagonal();

        if (rows || columns) {
            popupIfPlayerWin.classList.add('shown');
        }
    }

    //Ряды
    function checkIfWinRows(wholeBoardRow = []) {
        const targetMainRowCells = event.target.closest('.rowOfMainBoard').querySelectorAll('.mainCell');
        const targetInnerRow = event.target.closest('.rowOfInnerBoard');
        wholeBoardRow.push(targetInnerRow);

        //Проходимся по основным ячейкам ряда, на который нажали
        for (let currentMainCellIndex = 0; currentMainCellIndex < targetMainRowCells.length; currentMainCellIndex++) {
            //и из каждой ячейки берем ряды дочерней сетки
            const currentMainCellInnerRows = targetMainRowCells[currentMainCellIndex].querySelectorAll('.rowOfInnerBoard');
            //затем берем все ячейки, кроме той, на которую нажали
            const anotherMainCells = 
                Array.from(targetMainRowCells).filter((cell) => cell !== 
                event.target.closest('.mainCell'));

            //Проходимся по ячейкам anotherMainCells
            for (let anotherMainCellIndex = 0; anotherMainCellIndex < anotherMainCells.length; anotherMainCellIndex++) {
                //из каждой ячейки берем ряды
                const anotherMainCellsInnerRows = anotherMainCells[anotherMainCellIndex].querySelectorAll('.rowOfInnerBoard');
                //Проходимся по рядам currentMainCellInnerRows
                for (let currentRowIndex = 0; currentRowIndex < currentMainCellInnerRows.length; currentRowIndex++) {
                    if (currentMainCellInnerRows[currentRowIndex] === targetInnerRow) {
                        //Проходимся по рядам anotherMainCells
                        for (let anotherRowIndex = 0; anotherRowIndex < anotherMainCellsInnerRows.length; anotherRowIndex++) {
                            //если индекс ряда идентичен targetInnerRow, то добавляем в массив
                            if (anotherRowIndex === currentRowIndex) {
                                wholeBoardRow.push(anotherMainCellsInnerRows[anotherRowIndex]);
                            }
                        }
                    }
                }
            }
        }

        //Получаем все ячейки wholeBoardRow
        const allCellsRow = [];
        wholeBoardRow.forEach(innerRow => {
            const innerRowCells = innerRow.querySelectorAll('.innerCell');
            innerRowCells.forEach(cell => allCellsRow.push(cell));
        })

        return (allCellsRow.every((cell) => cell.style.backgroundImage === firstPlayer || 
            cell.style.backgroundImage === secondPlayer));
    }

    //Функция находит индексы ячеек, на которые нажали 
    function findEventTargetIndex(targetMainCellIndex = null, targetInnerCellIndex = null) {
        const targetInnerCell = event.target;

        //Определяем индекс основной ячейки (targetMainCellIndex):
        //проходимся по рядам основной сетки
        document.querySelectorAll('.rowOfMainBoard').forEach(currentMainRow => {
            //из каждого ряда берем ячейки
            const eachMainRowCells = Array.from(currentMainRow.querySelectorAll('.mainCell'));
            //находим основную ячейку, на которую нажали и определяем её индекс
            if (eachMainRowCells.includes(targetInnerCell.closest('.mainCell'))) {
                targetMainCellIndex = eachMainRowCells.indexOf(targetInnerCell.closest('.mainCell'))
            }
        })

        //Определяем индекс дочерней ячейки (targetInnerCellIndex):
        //проходимся по ячейкам основной сетки
        document.querySelectorAll('.mainCell').forEach(currentMainCell => {
            //из каждой основной ячейки берем ряды дочерней
            const innerRows = currentMainCell.querySelectorAll('.rowOfInnerBoard');
            innerRows.forEach(currentInnerRow => {
                //и из них берем ячейки дочерней сетки
                const innerRowCells = Array.from(currentInnerRow.querySelectorAll('.innerCell'));
                innerRowCells.forEach(currentRowCell => {
                    if (currentRowCell === event.target) {
                        targetInnerCellIndex = innerRowCells.indexOf(currentRowCell);
                    }
                })
            })
        })

        return {
            targetMainCellIndex,
            targetInnerCellIndex
        }
    }

    //Столбцы
    function checkIfWinColumn(wholeBoardColumn = []) {
        const targetIndex = findEventTargetIndex();

        document.querySelectorAll('.rowOfMainBoard').forEach(currentMainRow => {
            const eachMainRowCells = Array.from(currentMainRow.querySelectorAll('.mainCell'));
            //добавляем в массив все ячейки с индексом targetMainCellIndex, чтобы создать целую вертикальную строку
            for (let mainCellIndex = 0; mainCellIndex < eachMainRowCells.length; mainCellIndex++) {
                wholeBoardColumn.push(eachMainRowCells[targetIndex.targetMainCellIndex]);
            }
        })

        let allInnerCellsColumn = [];
        wholeBoardColumn.forEach(currentMainCell => {
            //из каждой основной ячейки берем ряды дочерней
            const innerRows = currentMainCell.querySelectorAll('.rowOfInnerBoard');
            innerRows.forEach(currentInnerRow => {
                //и из них берем ячейки дочерней сетки
                const innerRowCells = Array.from(currentInnerRow.querySelectorAll('.innerCell'));
                for (let innerRowCellIndex = 0; innerRowCellIndex < innerRowCells.length; innerRowCellIndex++) {
                    allInnerCellsColumn.push(innerRowCells[targetIndex.targetInnerCellIndex]);
                }
            })
        })

        return (allInnerCellsColumn.every((cell) => cell.style.backgroundImage === firstPlayer || 
            cell.style.backgroundImage === secondPlayer));
    }

    //по диагонали - доделать
    function checkIfWinDiagonal(wholeBoardDiagonal = []) {
        const firstMainRowOfBoard = document.querySelector('.rowOfMainBoard');
        const rightSideOfBoard = firstMainRowOfBoard.firstChild.querySelector('.rowOfInnerBoard').firstChild;
        const leftSideOfBoard = firstMainRowOfBoard.lastChild.querySelector('.rowOfInnerBoard').lastChild;
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

        const restartButton = document.querySelector('#restart');
        restartButton.addEventListener('click', () => {
            location.reload();
        })

        const closeButton = document.querySelector('#leave');
        closeButton.addEventListener('click', () => {
            location.href = "index.html";
        })
    });
}) ()