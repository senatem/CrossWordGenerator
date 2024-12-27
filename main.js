const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xD5C1FF,
    scene: {
        create: create,
    }
};

const game = new Phaser.Game(config);

/**
 * Creates a puzzle game with interactive elements, a shuffle button, and a graphical game board.
 * The board is dynamically generated and adjusted to fit the screen.
 */
function create() {
    const words = ["seat", "tea", "east", "set", "eat"]

    this.puzzle = this.add.container();
    this.graphics = this.add.graphics();

    const color = 0x000000;
    const thickness = 2;
    const alpha = 1;

    this.graphics.lineStyle(thickness, color, alpha);

    /**
     * Represents the shuffle button.
     */
    this.button = this.add.text(100, 100, 'Shuffle', { fontSize: '48px' , color: 'black', align: 'center', thickness: 'bold'});
    this.button.setInteractive();
    this.button.on('pointerdown', () => {
        this.puzzle.each(child => {child.destroy()});
        this.graphics.clear();

        let board = generatePuzzle(words);

        let boardH = board.squares.length;
        let boardW = board.squares[0].length;

        let sizeH = (config.height - 100) / boardH;
        let sizeW = (config.width - 100 )/ boardW;

        let squareSize = Math.min(sizeH, sizeW);

        let puzzleH = squareSize * boardH;
        let puzzleW = squareSize * boardW;
        let gapH = (config.height - puzzleH) / 2;
        let gapW = (config.width - puzzleW) / 2;

        for (let i = 0; i < board.squares.length; i++) {
            for (let j = 0; j < board.squares[i].length; j++) {
                if (board.squares[i][j].letter !== 0) {
                    this.graphics.strokeRect(gapW + j * squareSize, gapH + i * squareSize, squareSize, squareSize);
                    let text = this.add.text(gapW + j * squareSize, gapH + i * squareSize, board.squares[i][j].letter, {
                        fontSize: '96px',
                        color: 'black',
                        align: 'center',
                        thickness: 'bold'
                    });
                    this.puzzle.add(text);
                }
            }
        }

    })
}