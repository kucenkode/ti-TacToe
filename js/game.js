(function () {
    function createGameBoard() {
        const sizeOfBoard = sessionStorage.getItem('sizeOfBoard');
        const board = document.createElement('table');
        board.className = 'board';

        for (let i = 0; i < sizeOfBoard; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < sizeOfBoard; j++) {
                const cell = document.createElement('td');
                cell.className = "cell";
                row.appendChild(cell);
            };
            board.appendChild(row);
        }
        document.querySelector('.wrapper').appendChild(board);
    }

    document.addEventListener('DOMContentLoaded', () => {
        createGameBoard();
    })
}) ()