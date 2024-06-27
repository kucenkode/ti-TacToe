(function () {
    //Функция создает поле заданного пользователем размера
    function getTheSizeOfPlayingBoard() {
        const input = document.querySelector('#input-create-game-board');
        if (input.value.trim() && !(isNaN(input.value.trim()))) {
            sessionStorage.setItem('sizeOfBoard', input.value);
            location.href = "game.html";
        } else {
            input.classList.add('shake');

            setTimeout(() => {
                input.classList.remove('shake');
            }, 600);
        }
    }

    //Выбор уже существующих полей (2 на 2 и 3 на 3)
    function selectExistingGameBoards() {
        if (event.target.id === "game-mode-2-2") {
            sessionStorage.setItem('sizeOfBoard', 2);
            location.href = "game.html";
        }
        else if (event.target.id === "game-mode-3-3") {
            sessionStorage.setItem('sizeOfBoard', 3);
            location.href = "game.html";
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        const createBoardForm = document.querySelector('#create-game-board');
        createBoardForm.addEventListener('submit', (event) => {
            event.preventDefault();
            getTheSizeOfPlayingBoard();
        });

        const gameMode = document.querySelector('.game-mode');
        gameMode.addEventListener('click', (event) => {
            event.preventDefault();
            selectExistingGameBoards();
        });
    });
}) ()