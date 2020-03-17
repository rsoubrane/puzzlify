//Get the PGCD of 2 numbers
function pgcd(a, b) {
	if (b) return pgcd(b, a % b);
	else return Math.abs(a);
}

//Check if 2 arrays are identical
function arraysEqual(a, b) {
	if (a instanceof Array && b instanceof Array) {
		if (a.length != b.length)
			//Assert same length
			return false;
		for (
			var i = 0;
			i < a.length;
			i++ //Assert each element equal
		)
			if (!arraysEqual(a[i], b[i])) return false;
		return true;
	} else {
		return a == b; //If not both arrays, should be the same
	}
}

// const test = arraysEqual(
// 	[
// 		[1, 4, 7],
// 		[2, 5, 8],
// 		[3, 6, 0]
// 	],
// 	[
// 		[1, 4, 7],
// 		[2, 5, 0],
// 		[3, 6, 8]
// 	]
// );
