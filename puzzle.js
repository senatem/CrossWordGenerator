/**
 * Attempts to place a word on a game board following specified rules and constraints.
 *
 * @param {string} word - The word to be placed on the board.
 * @param {Object} board - The current state of the game board, including filled spaces and methods for placement.
 * @param {Array} candidates - An array of candidate positions where the word could potentially be placed.
 * @param {number} passCount - The current pass count used to manage retries when no valid candidates are available.
 * @return {number|undefined} Returns -1 if placing the word fails, otherwise undefined when the word is placed successfully.
 */
function placeWord(word, board, candidates, passCount) {
    if (board.filled.length === 0) {
        board.placeFirstWord(word);
        return;
    }

    if (candidates.length === 0 && passCount === 0) {
        candidates = board.getCandidates();
        passCount++;
        if (candidates.length === 0) return -1;
    } else if (candidates.length === 0) {
        return -1;
    }

    const candidate = candidates[getRandom(0, candidates.length - 1)];
    const intersection = word.indexOf(board.squares[candidate.row][candidate.col].letter);

    if (intersection === -1) {
        removeCoordinate(candidates, candidate);
        placeWord(word, board, candidates, passCount);
        return;
    }

    const { row, col, direction } = board.getNextPlacement(word, candidate, intersection);
    if (direction === null) {
        removeCoordinate(candidates, candidate);
        placeWord(word, board, candidates, passCount);
        return;
    }

    if (board.tryPlacement(word, row, col, direction, candidate)) {
        board.placeWord(word, row, col, direction);
    } else {
        removeCoordinate(candidates, candidate);
        placeWord(word, board, candidates, passCount);
    }
}

/**
 * Generates a puzzle board by placing words from a given list on it.
 * If placement is unsuccessful, it retries until a valid board is created.
 *
 * @param {string[]} words - An array of words to be placed on the puzzle board.
 * @return {Board} The generated puzzle board with successfully placed words.
 */
function generatePuzzle(words) {
    let wordList = words.slice();
    const board = new Board(calculateBoardSize(wordList));
    const candidates = []

    let len = wordList.length;
    let res = 0;

    for (let j = 0; j < len; j++) {
        let chosen = getRandom(0, wordList.length-1);
        let word = wordList[chosen];

        res = placeWord(word, board, candidates, 0);
        if(res === -1) {
            return generatePuzzle(words);
        }
        wordList.splice(chosen, 1);
    }

    if(board.words.length !== len) {
        return generatePuzzle(words);
    }

    board.cull();
    return board;
}