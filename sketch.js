function Array2D(cols, rows) {
	var arr = new Array(cols);
	for (var i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}

//Variables
var currentScreen = 0;
var canvasWidth = 540;
var canvasHeight = 540;
var maxRows = 6;
var rows = 4;
var cols = 4;
var spacing = 135;
var shuffle = 100;
var grid;
var useBackgroundImage;
var gridColor = "#000000";
var textColor = "#CD7F3D";
var borderColor = "#FFCC00";
var borderSize = 3;
var fontSize = 64;
var scoreCount = 0;
var newGameButton;
var shuffleButton;
var finishState;

let font;
let vehicles = [];

//Init Settings & interactive GUI
logic = QuickSettings.create(50, 150, "Partie");
logic.addButton("Nouvelle Partie", () => {
	resetBoard();
});
logic.addRange("Rows / Cols", 2, maxRows, rows, 1, v => {
	rows = v;
	cols = v;
	spacing = pgcd(canvasWidth / rows, height);
	setupBoard();
});
logic.addRange("Mouvements mélange", 10, 500, shuffle, 10, v => {
	shuffle = v;
});
logic.addButton("Mélanger", function() {
	shuffleBoard();
});

layout = QuickSettings.create(50, 450, "Réglages");
layout.addRange("Canvas Width / Height", 270, 1080, canvasWidth, 135, v => {
	if (canvasWidth < v) rows++ && cols++;
	else rows-- && cols--;
	canvasWidth = v;
	canvasHeight = v;
	spacing = pgcd(canvasWidth / rows, height);
	setupBoard();
});
layout.addBoolean("Utiliser une image en fond", useBackgroundImage, v => {
	useBackgroundImage = v;
});
layout.addColor("Couleur de la grille", gridColor, v => {
	gridColor = v;
});
layout.addColor("Couleur des bordures", borderColor, v => {
	borderColor = v;
});
layout.addRange("Taille des bordures", 0, 10, borderSize, 3, v => {
	borderSize = v;
});
layout.addColor("Couleur du texte", textColor, v => {
	textColor = v;
});
layout.addRange("Taille du texte", 20, 100, fontSize, 4, v => {
	fontSize = v;
});

function preload() {
	//Load the BG image
	img = loadImage("cat.jpg");
	font = loadFont("AvenirNextLTPro-Demi.otf");
}

function setup() {
	//Set the grid up
	setupBoard();

	var points = font.textToPoints("Bravo !!", 20, canvasHeight / 2 + 30, 140, {
		sampleFactor: 0.25
	});

	for (var i = 0; i < points.length; i++) {
		var pt = points[i];
		var vehicle = new Vehicle(pt.x, pt.y);
		vehicles.push(vehicle);
	}
}
function setupBoard() {
	const grid = new Grid(0, 0, canvasHeight, canvasWidth, rows, cols, spacing);
	//Make a deep clone so it's never changed and we can compare the original
	finishState = JSON.parse(JSON.stringify(grid));
}

//Core of the game - Function to check which side the tile should slide
function slide(x, y) {
	var mx = floor(x / spacing);
	var my = floor(y / spacing);
	var num = grid[mx][my];
	var neighbors;

	//Check every scenario
	if (mx == 0) neighbors = [grid[mx + 1][my], grid[mx][my + 1], grid[mx][my - 1]];
	else if (mx == cols - 1) neighbors = [grid[mx - 1][my], grid[mx][my + 1], grid[mx][my - 1]];
	else neighbors = [grid[mx + 1][my], grid[mx - 1][my], grid[mx][my + 1], grid[mx][my - 1]];
	for (var i = 0; i < neighbors.length; i++) {
		if (neighbors[i] == 0) {
			var temp = grid[mx][my];
			if (mx != cols - 1) {
				if (neighbors[i] == grid[mx + 1][my]) {
					grid[mx][my] = 0;
					grid[mx + 1][my] = temp;
				}
			}
			if (mx != 0) {
				if (neighbors[i] == grid[mx - 1][my]) {
					grid[mx][my] = 0;
					grid[mx - 1][my] = temp;
				}
			}
			if (neighbors[i] == grid[mx][my + 1]) {
				grid[mx][my] = 0;
				grid[mx][my + 1] = temp;
			}
			if (neighbors[i] == grid[mx][my - 1]) {
				grid[mx][my] = 0;
				grid[mx][my - 1] = temp;
			}
		}
	}
}

//Check where the mouse is pressed and slide the piece accordingly
function mousePressed() {
	if (currentScreen === 0) currentScreen = 1;
	else if (currentScreen === 1) {
		if (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {
			slide(mouseX, mouseY);
			const isCorrect = arraysEqual(grid, finishState);
			if (isCorrect)
				setTimeout(() => {
					gameOver();
				}, 500);
		}
	} else currentScreen = 0;
}

//Function to shuffle the board randomly
function shuffleBoard() {
	for (var i = 0; i < cols; i++) {
		//Set the new grid values
		for (var j = 0; j < rows; j++) {
			grid[i][j] = i + j * cols + 1;
			if (grid[i][j] == cols * rows) grid[i][j] = 0;
		}
	}
	//Set the amount of move for randomness
	let moves;
	if (typeof shuffle === "number") moves = shuffle;
	else moves = 100;
	for (var k = 0; k < moves; k++) slide(random(width), random(height));
}

//Executes when user won
function gameOver() {
	currentScreen = 2;
}

//Function to reset the game to its original state
function resetBoard() {
	currentScreen = 1;
	setupBoard();
}

function draw() {
	if (currentScreen === 0) {
		createCanvas(canvasWidth, canvasHeight);
		background(0, 0, 0);
		fill(255);
		textSize(60);
		textAlign(CENTER, CENTER);
		text("Bienvenue sur Puzzlify", 0, 40, canvasWidth);
		textSize(50);
		textAlign(CENTER, CENTER);
		text("Cliquez pour commencer", 0, canvasHeight / 2, canvasWidth);
	} else if (currentScreen === 1) {
		useBackgroundImage ? background(img) : background(0, 0, 0);

		//Draw the grid
		for (var i = 0; i < cols; i++) {
			for (var j = 0; j < rows; j++) {
				var x = i * spacing;
				var y = j * spacing;

				useBackgroundImage ? fill(0, 0, 0, 60) : fill(gridColor);

				strokeWeight(borderSize);
				stroke(borderColor);
				rect(x, y, spacing, spacing);
				var xt = x + spacing / 2;
				var yt = y + spacing / 2;

				//Write the number on the element
				var num = grid[i][j];
				if (num != 0) {
					strokeWeight(0);
					fill(textColor);
					textSize(fontSize);
					textAlign(CENTER, CENTER);
					text(num, xt, yt);
				}
			}
		}
	} else if (currentScreen === 2) {
		createCanvas(canvasWidth, canvasHeight);
		background(0, 0, 0);
		textAlign(CENTER, CENTER);

		// text(message, canvasWidth / 2, canvasHeight / 2);
		for (var i = 0; i < vehicles.length; i++) {
			var v = vehicles[i];
			v.behaviors();
			v.update();
			v.show();
		}
	}
}
