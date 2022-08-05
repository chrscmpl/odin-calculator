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
 * 			Power "√" Primary     *
 * Primary:                   *
 *      Number                *
 *      "(" Expression ")"    *
 *      "[" Expression "]"    *
 *      "{" Expression "}"    *
 *      "|" Expression "|"    *
 *      "-" Primary           *
 *      "+" Primary           *
 * Number:                    *
 *      Floating-point-literal*
 *****************************/

function Expression(expression) {
	//removes whitespace
	expression = expression.replace(/\s/g, '');

	//make parsed an array of instances of Term() alternated with operators
	const parsed = parse(expression, '+', '-').map(term =>
		term === '+' || term === '-' ? term : new Term(term)
	);
	this.result = computeResult(parsed);
}

function Term(term) {
	//make parsed an array of instances of Power() alternated with operators
	const parsed = parse(term, '*', '/', '%').map(power =>
		power === '*' || power === '/' || power === '%' ? power : new Power(power)
	);
	this.result = computeResult(parsed);
}

function Power(power) {
	//make parsed an array of instances of Primary() alternated with operators
	const parsed = parse(power, '^').map(primary =>
		primary === '^' ? primary : new Primary(primary)
	);
	this.result = computeResult(parsed);
}

function Primary(primary) {
	let negative = false;
	if (primary[0] === '-') negative = true;
	if (primary[0] === '-' || primary[0] === '+') {
		primary = primary.slice(1);
	}
	this.result = isWrapped(primary, 1)
		? new Expression(primary.slice(1, primary.length - 1)).result
		: +primary;
	if (primary[0] === '|')
		this.result = this.result > 0 ? this.result : -this.result;
	if (negative) this.result = -this.result;
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
		console.log(
			`${res} ${members[i]} ${members[i + 1].result} = ${compute(
				res,
				members[i + 1].result,
				members[i]
			)}`
		);
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

function isSign(curr, prev) {
	return (
		(curr === '-' || curr === '+') &&
		(!prev || allOperators.some(op => op === prev))
	);
}

const allOperators = ['+', '-', '*', '/', '%', '^'];

const expression = new Expression('(4 * -(9*-1)/-9)^3-(8*(+2-4)+ 16)^2');
console.log(`the result is ${expression.result}`);
