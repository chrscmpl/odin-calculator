const screen = document.getElementById('screen-content');
const digits = document.querySelectorAll('.digit');
const operators = document.querySelectorAll('.basic-operator');

digits.forEach(digit => {
	digit.addEventListener('click', e => {
		print(e.target.textContent);
	});
});

operators.forEach(operator => {
	operator.addEventListener('click', e => {
		print(e.target.textContent);
	});
});

function print(char) {
	screen.textContent += char;
	screen.scrollLeft = screen.scrollWidth;
}

/******************************
 * Expression:                *
 *      Term                  *
 *      Expression "+" Term   *
 *      Expression "-" term   *
 * Term:                      *
 *      Power                 *
 *      Term "*" Power        *
 *      Term "/" Power        *
 *      Term "%" Power  	    *
 * Power:                     *
 *      Primary               *
 *      Power "^" Primary     *
 * Primary:                   *
 *      Number                *
 *      "(" Expression ")"    *
 *      "[" Expression "]"    *
 *      "{" Expression "}"    *
 *      "|" Expression "|"    *
 *      "-" Primary           *
 *      "+" Primary           *
 * 			Primary "!"						*
 * Number:                    *
 *      Floating-point-literal*
 *****************************/

function Expression(expression) {
	//removes whitespace
	expression = expression.replace(/\s/g, '');

	//make parsed an array of instances of Term() alternated with operators
	const parsed = parse(expression, '+', '-').map(term =>
		isOperator(term) ? term : new Term(term)
	);
	this.result = computeResult(parsed);
}

function Term(term) {
	//make parsed an array of instances of Power() alternated with operators
	const parsed = parse(term, '*', '/', '%').map(power =>
		isOperator(power) ? power : new Power(power)
	);
	this.result = computeResult(parsed);
}

function Power(power) {
	//make parsed an array of instances of Primary() alternated with operators
	const parsed = parse(power, '^').map(primary =>
		isOperator(primary) ? primary : new Primary(primary)
	);
	this.result = computeResult(parsed);
}

function Primary(primary) {
	// If the primary is followed by a factorial symbol
	// calculate the result as normal and calculate the
	// factorial from that after
	if (primary[primary.length - 1] === '!') {
		this.result = new Primary(primary.slice(0, primary.length - 1)).result;
		this.result = factorial(this.result);
	}
	// Else if the primary is preceded by a sign ignore it and change
	// the sign of the result after calculating if it is a -
	else if (primary[0] === '+' || primary[0] === '-') {
		this.result = new Primary(primary.slice(1)).result;
		if (primary[0] === '-') this.result = -this.result;
	}
	// Else if the primary is wrapped between parenthesis
	// parse it as an expression
	else if (isWrapped(primary, 1)) {
		this.result = new Expression(primary.slice(1, primary.length - 1)).result;
		// If the parenthesis the primary was wrapped between are
		// modulus symbols return the absolute value
		if (primary[0] === '|')
			this.result = this.result > 0 ? this.result : -this.result;
	} // Else the primary's value is equal to it's input
	else {
		this.result = +primary;
	}
}

function parse(str, ...operators) {
	let res = [];
	for (let i = 0; i < str.length; i++) {
		// for every operator in the string that is not
		// wrapped between parenthesis that does not
		// represent the number's sign
		if (
			operators.some(op => op === str[i]) &&
			!isWrapped(str, i) &&
			!isSign(str[i], str[i - 1])
		) {
			// append the term and the operator to the
			// result and remove them from the string
			res.push(str.slice(0, i));
			res.push(str.substr(i, 1));
			str = str.slice(i + 1);
			i = 0;
		}
	}
	res.push(str);
	return res;
}

function computeResult(members) {
	let res = members[0].result;
	for (let i = 1; i < members.length - 1; i += 2) {
		// console.log(
		// 	`${res} ${members[i]} ${members[i + 1].result} = ${compute(
		// 		res,
		// 		members[i + 1].result,
		// 		members[i]
		// 	)}`
		// );
		res = compute(res, members[i + 1].result, members[i]);
	}
	return res;
}

function compute(a, b, operator) {
	switch (operator) {
		case '+':
			return a + b;
		case '-':
			return a - b;
		case '*':
			return a * b;
		case '/':
			return a / b;
		case '%':
			return a % b;
		case '^':
			return a ** b;
	}
}

// returns true if the index is wrapped between a pair of two matching parenthesis
function isWrapped(str, index) {
	for (let i = 0; i < index; i++)
		if (
			(str[i] === '(' || str[i] === '[' || str[i] === '{' || str[i] === '|') &&
			findMatchingBracket(str, i) > index
		)
			return true;
	return false;
}

// if a matching bracket is found after the bracket and no
//similar opening bracket was between them returns the index
//of the matching bracket
function findMatchingBracket(str, bracket) {
	const matching = matchingBracket(str[bracket]);
	for (let i = bracket + 1, similar = 0; i < str.length; i++) {
		if (str[i] === matching) {
			if (similar) similar--;
			else return i;
		} else if (str[i] === str[bracket]) similar++;
	}
}

// returns true if the + or - is the first character
// of the string or if it is preceded by another operator
function isSign(curr, prev) {
	return (curr === '-' || curr === '+') && (!prev || isOperator(prev));
}

function isOperator(char) {
	const operators = ['+', '-', '*', '/', '%', '^'];
	return operators.some(op => op === char);
}

function factorial(n) {
	if (n < 0) return NaN;
	else if (n < 2) return 1;
	else return factorial(n - 1) * n;
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
