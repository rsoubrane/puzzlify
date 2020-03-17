//VARIABLES
var img;

// This array will hold the squares we split our image into.
var imgSquares = [];

var squareWidth;
var squareHeight;

//SETUP

// Resizes the image so it fits on the screen
img.resize(canvasWidth, canvasHeight);

// Calculates the size of the squares.
squareWidth = canvasWidth / rows;
squareHeight = canvasHeight / cols;

// Split the image up into squares.
img.loadPixels();
for (var y = 0; y < canvasWidth; y += squareHeight) {
	for (var x = 0; x < canvasWidth; x += squareWidth) {
		imgSquares.push(img.get(x, y, squareWidth, squareHeight));
	}
}
// other setup
pd = pixelDensity();
noLoop();

//DRAW

// This randomizes the order of the squares
imgSquares = shuffle(imgSquares);

// Keeps track of the position of the current square.
// We change these as we draw each square,
// so we know where to draw the next one.
var squareX = 0;
var squareY = 0;
for (var square of imgSquares) {
	// Draw this square.
	image(square, squareX, squareY);

	// Draw the next square to the right of this square.
	squareX += squareWidth;
	// If we went off the right edge, we should move down
	// one row and start over at the left edge.
	if (squareX >= width) {
		squareX = 0;
		squareY += squareHeight;
	}
}
