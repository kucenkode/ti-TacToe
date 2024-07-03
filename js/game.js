(function () {
    function createGameBoard() {
        const sizeOfBoard = sessionStorage.getItem('sizeOfBoard');
        const board = document.createElement('table');
        board.className = 'board';

        // Формируем основную сетку
        for (let i = 0; i < sizeOfBoard; i++) {
            const rowOfMainBoard = document.createElement('tr');
            for (let j = 0; j < sizeOfBoard; j++) {
                const mainCell = document.createElement('td');
                mainCell.className = "mainCell";

                // А теперь сетку внутри каждой ячейки основной сетки
                const innerBoard = document.createElement('table');
                innerBoard.className = 'innerBoard';
                for (let k = 0; k < sizeOfBoard; k++) {
                    const rowOfInnerBoard = document.createElement('tr');
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
            board.appendChild(rowOfMainBoard);
            document.querySelector('.wrapper').appendChild(board);
        }
    }

    //Функция окрашивает игровое поле
    function randomColor(){
        let hue = Math.floor(Math.random() * 15) + 30;
        let color = "hsl(" + hue + ", 100%, 75%)";
        return color;
    }
    
    function makeAMove() {
        if(event.target.className === "innerCell") {
            event.target.style.backgroundImage = "url('img/cross.png')";
        }
        
    }

    document.addEventListener('DOMContentLoaded', () => {

        //Поле помещаем сразу при загрузке страницы
        createGameBoard();

        const board = document.querySelector('.board');
        board.addEventListener('click', (event) => {
            event.preventDefault();
            makeAMove();
        });
    });
}) ()