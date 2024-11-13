const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const modeButton = document.getElementById('modeButton');
const gameOverModal = document.getElementById('gameOverModal');
const gameOverMessage = document.getElementById('gameOverMessage');
const playAgainButton = document.getElementById('playAgainButton');
const quitButton = document.getElementById('quitButton');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'Grass Hater';
let isAiMode = false;
let gameOver = false;

modeButton.addEventListener('click', () => {
    isAiMode = !isAiMode;
    gameOver = false;
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'Grass Hater';
    renderBoard();
    statusElement.textContent = isAiMode ? "AI Mode: Grass Hater's turn" : "Grass Hater's turn";
    modeButton.textContent = isAiMode ? "Switch to Normal Mode" : "Switch to AI Mode";
});

function renderBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
        cell.style.pointerEvents = board[index] || gameOver ? 'none' : 'auto';
    });
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function checkTie() {
    return board.every(cell => cell !== '') && !checkWinner();
}

function handlePlayerMove(index) {
    if (board[index] || gameOver) return;
    
    board[index] = currentPlayer;
    renderBoard();
    const winner = checkWinner();

    if (winner) {
        gameOver = true;
        showGameOverModal(`${winner} wins!`);
        return;
    }

    if (checkTie()) {
        gameOver = true;
        showGameOverModal("It's a tie!");
        return;
    }

    currentPlayer = currentPlayer === 'Grass Hater' ? 'Grass Enjoyer' : 'Grass Hater';
    statusElement.textContent = isAiMode ? "AI Mode: Player " + currentPlayer + "'s turn" : `Player ${currentPlayer}'s turn`;

    if (isAiMode && currentPlayer === 'Grass Enjoyer') {
        aiMove();
    }
}

function minimax(board, depth, isMaximizingPlayer) {
    const winner = checkWinner();
    if (winner === 'Grass Enjoyer') return 10 - depth;
    if (winner === 'Grass Hater') return depth - 10;
    if (board.every(cell => cell !== '')) return 0;

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'Grass Enjoyer';
                const eval = minimax(board, depth + 1, false);
                board[i] = '';
                maxEval = Math.max(maxEval, eval);
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'Grass Hater';
                const eval = minimax(board, depth + 1, true);
                board[i] = '';
                minEval = Math.min(minEval, eval);
            }
        }
        return minEval;
    }
}

function aiMove() {
    let bestMove = -1;
    let bestValue = -Infinity;
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'Grass Enjoyer';
            const moveValue = minimax(board, 0, false);
            board[i] = '';
            if (moveValue > bestValue) {
                bestValue = moveValue;
                bestMove = i;
            }
        }
    }

    if (bestMove !== -1) {
        setTimeout(() => {
            board[bestMove] = 'Grass Enjoyer';
            renderBoard();
            const winner = checkWinner();
            if (winner) {
                gameOver = true;
                showGameOverModal(`${winner} wins!`);
            } else {
                currentPlayer = 'Grass Hater';
                statusElement.textContent = "Grass Hater's turn";
            }
        }, 500);
    }
}

function showGameOverModal(message) {
    gameOverMessage.textContent = message;
    gameOverModal.style.display = 'flex';
}

playAgainButton.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    gameOver = false;
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'Grass Hater';
    renderBoard();
    statusElement.textContent = isAiMode ? "AI Mode: Grass Hater's turn" : "Grass Hater's turn";
});

quitButton.addEventListener('click', () => {
    window.location.href = 'about:blank';
});

boardElement.addEventListener('click', (e) => {
    const index = e.target.dataset.index;
    if (index !== undefined) {
        handlePlayerMove(parseInt(index));
    }
});
