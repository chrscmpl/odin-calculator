function Expression(expr) {
	expr = expr.replace(/\s/g, '');
	this.expr = expr;
	this.Terms = parseTerms(expr);
}

function parseTerms(expr) {
	let res = [];
	for (let i = 0; i < expr.length; i++) {
		// for every + or - in the expression
		if (expr[i] === '+' || expr[i] === '-') {
			// if the + or - is not contained between parenthesis
			if (!isWrapped(expr, i)) {
				//append the term before + or - to the result and remove it from the expression
				res.push(expr.slice(0, i));
				expr = expr.slice(i + 1);
				i = 0;
			}
		}
	}
	res.push(expr);
	return res;
}

// returns true if the index is wrapped between a pair of two matching parenthesis
function isWrapped(expr, index) {
	for (let i = 0; i < index; i++)
		if (
			(expr[i] === '(' ||
				expr[i] === '[' ||
				expr[i] === '{' ||
				expr[i] === '|') &&
			findMatchingBracket(expr, i) > index
		)
			return true;
	return false;
}

// if a matching bracket is found after the bracket and no
//similar opening bracket was between them returns the index
//of the matching bracket
function findMatchingBracket(expr, bracket) {
	const matching = matchingBracket(expr[bracket]);
	for (let i = bracket + 1, similar = 0; i < expr.length; i++) {
		if (expr[i] === expr[bracket]) similar++;
		else if (expr[i] === matching) {
			if (similar) similar--;
			else return i;
		}
	}
}

function matchingBracket(bracket) {
	switch (bracket) {
		case '(':
			return ')';
		case '[':
			return ']';
		case '{':
			return '}';
		case '|':
			return '|';
	}
}

const expression = new Expression('1 + 2 * 3 + (4 + 2 + (2-3-6))');
console.log(expression);
