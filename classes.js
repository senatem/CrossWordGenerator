/**
 * An enumeration representing possible directions.
 *
 * @typedef {Object} Directions
 * @property {number} Horizontal - Represents the horizontal direction with a value of 0.
 * @property {number} Vertical - Represents the vertical direction with a value of 1.
 */
const Directions = {
    Horizontal: 0,
    Vertical: 1,
}

/**
 * Represents a square in a crossword-style puzzle.
 * Each square contains a letter and is associated with horizontal and vertical words.
 */
class PuzzleSquare{
    constructor(letter, wordHorizontal, wordVertical) {
        this.letter = letter;
        this.wordHorizontal = wordHorizontal;
        this.wordVertical = wordVertical;
    }
}

/**
 * Represents a pair of coordinates with a row and column value.
 */
class Coordinates{
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}