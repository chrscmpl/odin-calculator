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
 * 			Power "V" Primary     *
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
	console.log('TERMS');
	console.table(this.terms);
	this.parsedTerms = this.terms.map(term => new Term(term));
}

function Term(term) {
	this.term = term;
	this.powers = parse(term, '*', '/', '%');
	console.log('POWERS');
	console.table(this.powers);
	this.parsedPowers = this.powers.map(power => new Power(power));
}

function Power(power) {
	this.power = power;
	this.primaries = parse(power, '^', '√');
	console.log('PRIMARIES');
	console.table(this.primaries);
	this.parsedPrimaries = this.primaries.map(primary => new Primary(primary));
}

function Primary(primary) {
	this.primary = primary;
	this.value = isWrapped(primary, primary[1])
		? new Expression(primary.slice(1, primary.length - 1))
		: primary;
	console.log('VALUE');
	console.table(this.value);
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

const expression = new Expression('1 ^ 6 + 2 * 3 ^ 5 + (4 + 2 + (2-3-6))');
// console.table(expression);
// expression.parsedTerms.forEach(term => console.table(term));
