/**
 * Generates a random integer between the specified minimum and maximum values, inclusive.
 *
 * @param {number} min - The minimum value of the random integer range.
 * @param {number} max - The maximum value of the random integer range.
 * @return {number} A random integer between the specified min and max values.
 */
function getRandom(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

/**
 * Compares two numeric values and returns the smaller of the two.
 *
 * @param {number} a - The first number to compare.
 * @param {number} b - The second number to compare.
 * @return {number} The smaller of the two numbers.
 */
function getMin(a, b) {
    return a < b ? a : b;
}

/**
 * Compares two numbers and returns the greater value.
 *
 * @param {number} a - The first number to compare.
 * @param {number} b - The second number to compare.
 * @return {number} The greater of the two numbers.
 */
function getMax(a, b) {
    return a > b ? a : b;
}

/**
 * Removes a specific coordinate from the given array of coordinates.
 *
 * @param {Array} array - The array of coordinate objects to modify.
 * @param {Object} coordinate - The coordinate object to remove, having `row` and `col` properties.
 */
function removeCoordinate(array, coordinate) {
    array.splice(array.findIndex(c => c.row === coordinate.row && c.col === coordinate.col), 1)
}

/**
 * Generates an array of coordinate objects projecting the given word on the board in the specified direction.
 *
 * @param {string} word - The word to be projected.
 * @param {string} direction - The direction of the projection (e.g., "Horizontal" or "Vertical").
 * @param {number} row - The starting row for the projection.
 * @param {number} col - The starting column for the projection.
 * @return {Array} An array of coordinate objects representing the projection of the word.
 */
function projection(word, direction, row, col) {
    let projection = []
    for (let i = 0; i < word.length; i++){
        if(direction === Directions.Horizontal) {
            projection.push(new Coordinates(row, col + i));
        } else {
            projection.push(new Coordinates(row + i, col));
        }
    }
    return projection;
}

/**
 * Calculates the board size based on the given list of words.
 *
 * @param {string[]} wordList - An array of words used to calculate the board size.
 * @return {number} The calculated board size derived from the selected words' lengths.
 */
function calculateBoardSize(wordList) {
    let num = wordList.length;
    let maxWords = Math.ceil(num / 2)
    return 2 * wordList.sort((a, b) => b.length - a.length).toSpliced(0, maxWords).reduce((acc, cur) => acc + cur.length, 0);
}