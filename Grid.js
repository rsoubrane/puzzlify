//Class that will generate the board
class Grid {
	constructor(x, y, canvasHeight, canvasWidth, rows, cols, spacing) {
		createCanvas(canvasWidth, canvasHeight);
		grid = new Array2D(rows, cols);
		for (var i = 0; i < cols; i++) {
			//Set the values of the cells
			for (var j = 0; j < rows; j++) {
				grid[i][j] = i + j * cols + 1;
				if (grid[i][j] == rows * cols) grid[i][j] = 0;
			}
		}
		return grid;
	}
}
