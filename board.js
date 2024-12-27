/**
 * Represents a crossword puzzle board.
 */
class Board {
    constructor(size) {
        this.squares = this.generateBoard(size);
        this.filled = [];
        this.words = [];
    }

    /**
     * Generates a square game board with the specified size.
     *
     * @param {number} size - The size of the game board (number of rows and columns).
     * @return {PuzzleSquare[][]} A two-dimensional array representing the game board,
     * where each element is an instance of the PuzzleSquare class initialized with default values.
     */
    generateBoard(size) {
        return Array.from({length: size}, () =>
            Array.from({length: size}, () => new PuzzleSquare(0, 0, 0))
        );
    }

    /**
     * Adjusts the board to only include the minimal rectangular area where letters are present.
     */
    cull() {
        const boardSize = this.squares.length;

        let startH = boardSize - 1;
        let startV = boardSize - 1;
        let endH = 0;
        let endV = 0;

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < this.squares[i].length; j++) {
                if (this.squares[i][j].letter !== 0) {
                    startH = getMin(startH, i);
                    startV = getMin(startV, j);
                    endH = getMax(endH, i);
                    endV = getMax(endV, j);
                }
            }
        }

        this.squares = this.squares
            .slice(startH, endH + 1)
            .map(row => row.slice(startV, endV + 1));
    }

    /**
     * Determines whether a specific coordinate in a grid represents a "T-corner." (a corner where two words intersect)
     *
     * @param {number} row - The row index of the cell to be checked.
     * @param {number} col - The column index of the cell to be checked.
     * @return {boolean} Returns true if the specified cell qualifies as a "T-corner," otherwise false.
     */
    isTCorner(row, col) {
        if (
            row === 0 ||
            row === this.squares.length - 1 ||
            col === 0 ||
            col === this.squares[0].length - 1
        ) {
            return true;
        }

            if(row === 0 || row === this.squares.length - 1 || col === 0 || col === this.squares.length) { return true; }
            let squareUpperLeft = this.squares[row-1][col-1];
            let squareLowerLeft = this.squares[row+1][col-1];
            let squareUpperRight = this.squares[row-1][col+1];
            let squareLowerRight = this.squares[row+1][col+1];
            return squareUpperLeft.letter !== 0 && squareUpperRight.letter !== 0 ? true :
                 squareLowerLeft.letter !== 0 && squareLowerRight.letter !== 0 ? true :
                     squareUpperLeft.letter !== 0 && squareLowerLeft.letter !== 0 ? true :
                         squareUpperRight.letter !== 0 && squareLowerRight.letter !== 0;
    }

    /**
     * Places a given word onto the puzzle grid at the specified position and direction.
     *
     * @param {string} word - The word to place on the puzzle grid.
     * @param {number} row - The starting row index for placing the word.
     * @param {number} col - The starting column index for placing the word.
     * @param {string} direction - The direction in which to place the word (e.g., horizontal or vertical).
     */
    placeWord(word, row, col, direction) {
        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            let square;
            let coordinates;
            if(direction === Directions.Horizontal) {
                coordinates = new Coordinates(row, col + i);
                square = new PuzzleSquare(letter, word, this.squares[coordinates.row][coordinates.col].wordVertical);
            } else {
                coordinates = new Coordinates(row + i, col);
                square = new PuzzleSquare(letter, this.squares[coordinates.row][coordinates.col].wordHorizontal, word);
            }
            this.squares[coordinates.row][coordinates.col] = square;
            this.filled.push(coordinates);
        }
        this.words.push(word);
    }

    /**
     * Places the given word at the center of the board in a random direction (horizontal or vertical).
     *
     * @param {string} word - The word to be placed on the board.
     */
    placeFirstWord(word) {
        const direction = getRandom(0, 1) === 0 ? Directions.Horizontal : Directions.Vertical;
        const center = ~~((this.squares.length - 1) / 2);
        this.placeWord(word, center, center, direction);
    }

    /**
     * Filters and returns a list of candidates from the filled coordinates.
     * Candidates are determined based on the intersections of the words.
     *
     * @return {Array} Returns an array of filled coordinates that are valid candidates.
     */
    getCandidates() {
        return this.filled.filter(filledCoordinate => {
            const square = this.squares[filledCoordinate.row][filledCoordinate.col];
            const hasNoWordHorizontal = square.wordHorizontal === 0;
            const hasNoWordVertical = square.wordVertical === 0;

            return (
                (hasNoWordHorizontal || hasNoWordVertical) &&
                !this.isTCorner(filledCoordinate.row, filledCoordinate.col)
            );
        });
    }

    /**
     * Determines the direction of a word in a grid based on the given row and column.
     *
     * @param {number} row - The row index of the square to check.
     * @param {number} col - The column index of the square to check.
     * @return {number} Returns -1 if there is no word,
     * Directions.Horizontal if the word is horizontal,
     * Directions.Vertical if the word is vertical,
     * or -2 if both directions are present.
     */
    getDirection(row, col) {
        const {wordHorizontal, wordVertical} = this.squares[row][col];

        if (wordHorizontal === 0 && wordVertical === 0) {
            return -1;
        }
        if (wordHorizontal !== 0 && wordVertical === 0) {
            return Directions.Horizontal;
        }
        if (wordHorizontal === 0 && wordVertical !== 0) {
            return Directions.Vertical;
        }
        return -2;
    }

    /**
     * Determines the next placement for a word based on the provided candidate position and intersection point.
     *
     * @param {string} word - The word to be placed.
     * @param {Object} candidate - The candidate position object containing row and column information.
     * @param {number} intersection - The point of intersection between the current word and another word.
     * @return {Object} Returns an object containing the placement direction, row, and column for the next word.
     */
    getNextPlacement(word, candidate, intersection) {
        const contactDirection = this.getDirection(candidate.row, candidate.col);

        if (contactDirection === Directions.Horizontal) {
            return {
                direction: Directions.Vertical,
                row: candidate.row - intersection,
                col: candidate.col,
            };
        }
        if (contactDirection === Directions.Vertical) {
            return {
                direction: Directions.Horizontal,
                row: candidate.row,
                col: candidate.col - intersection,
            };
        }
        return {direction: null};
    }

    /**
     * Attempts to place a word on a game board at the specified location and direction.
     * Checks if the placement is valid based on the board rules and candidate position.
     *
     * @param {string} word - The word to be placed on the board.
     * @param {number} row - The starting row index for the placement.
     * @param {number} col - The starting column index for the placement.
     * @param {string} direction - The direction of placement, e.g., "horizontal" or "vertical".
     * @param {Object} candidate - The specific candidate cell position to consider during placement validation.
     * @return {boolean} Returns true if the word can be legally placed at the specified position, otherwise false.
     */
    tryPlacement(word, row, col, direction, candidate) {
        const projected = projection(word, direction, row, col);
        return !projected.some(coord =>
            coord.row !== candidate.row || coord.col !== candidate.col
                ? this.isIllegalMove(coord, direction)
                : false
        );
    }

    /**
     * Determines the legality of the move.
     *
     * @param {Object} coord - The coordinate of the square being checked.
     * @param {string} direction - The direction of the move.
     * @return {boolean} Returns `true` if the move is illegal, otherwise `false`.
     */
    isIllegalMove(coord, direction) {
        const square = this.squares[coord.row][coord.col];

        if (direction === Directions.Horizontal) {
            return (
                (this.squares[coord.row - 1]?.[coord.col]?.wordHorizontal !== 0 ||
                    this.squares[coord.row + 1]?.[coord.col]?.wordHorizontal !== 0) ||
                (this.squares[coord.row - 1]?.[coord.col]?.letter !== 0 &&
                    this.squares[coord.row - 1]?.[coord.col]?.wordVertical !==
                    square.wordVertical) ||
                (this.squares[coord.row + 1]?.[coord.col]?.letter !== 0 &&
                    this.squares[coord.row + 1]?.[coord.col]?.wordVertical !==
                    square.wordVertical)
            );
        }

        if (direction === Directions.Vertical) {
            return (
                (this.squares[coord.row]?.[coord.col - 1]?.wordVertical !== 0 ||
                    this.squares[coord.row]?.[coord.col + 1]?.wordVertical !== 0) ||
                (this.squares[coord.row]?.[coord.col - 1]?.letter !== 0 &&
                    this.squares[coord.row]?.[coord.col - 1]?.wordHorizontal !==
                    square.wordHorizontal) ||
                (this.squares[coord.row]?.[coord.col + 1]?.letter !== 0 &&
                    this.squares[coord.row]?.[coord.col + 1]?.wordHorizontal !==
                    square.wordHorizontal)
            );
        }

        return false;
    }
}