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
	expression = expression.replace(/\s/g, '');
	this.expression = expression;
	this.terms = parse(expression, '+', '-');
	this.parsedTerms = this.terms.map(term => new Term(term));
	console.log('EXPRESSION');
	this.value = computeValue(expression, this.terms, this.parsedTerms);
}

function Term(term) {
	this.term = term;
	this.powers = parse(term, '*', '/', '%');
	this.parsedPowers = this.powers.map(power => new Power(power));
	console.log('TERM');
	this.value = computeValue(term, this.powers, this.parsedPowers);
}

function Power(power) {
	this.power = power;
	this.primaries = parse(power, '^', '√');
	this.parsedPrimaries = this.primaries.map(primary => new Primary(primary));
	console.log('POWER');
	this.value = computeValue(power, this.primaries, this.parsedPrimaries);
}

function Primary(primary) {
	this.primary = primary;
	this.value = isWrapped(primary, primary[1])
		? new Expression(primary.slice(1, primary.length - 1)).value
		: primary;
}

function parse(str, ...separators) {
	let res = [];
	for (let i = 0; i < str.length; i++) {
		// for every separator in the string that is not
		//wrapped between parenthesis
		if (separators.some(sep => sep === str[i]) && !isWrapped(str, i)) {
			//append the term before the separator to
			//the result and remove it from the string
			res.push(str.slice(0, i));
			str = str.slice(i + 1);
			i = 0;
		}
	}
	res.push(str);
	return res;
}

function computeValue(str, parsedStr, members) {
	let res = +members[0].value;
	for (let i = 1; i < parsedStr.length; i++) {
		console.log(
			`${res} ${str[str.indexOf(parsedStr[i]) - 1]} ${
				members[i].value
			} = ${compute(
				res,
				+members[i].value,
				str[str.indexOf(parsedStr[i]) - 1]
			)}`
		);
		res = compute(res, +members[i].value, str[str.indexOf(parsedStr[i]) - 1]);
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
		if (str[i] === str[bracket]) similar++;
		else if (str[i] === matching) {
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

const expression = new Expression('3 * 4 ^ 3 - (2 * 9 - 1)');
console.log(`the result is ${expression.value}`);
// console.table(expression);
// expression.parsedTerms.forEach(term => console.table(term));
