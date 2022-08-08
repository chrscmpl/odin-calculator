function Calculator(screenBottom, screenTop) {
	this.screenBottom = screenBottom;
	this.screenTop = screenTop;

	this.primary = '';
	this.expression = '';
	this.showingResult = false;

	//Adds the input plus this.primary to this.expression if
	//the input is an operator, and this.primary is a valid expression
	//otherwise adds the input to this.primary
	this.input = function (char) {
		this.clearAfterResult(char);
		if (isOperator(char) && !isPower(char) && isValidExpression(this.primary)) {
			this.expression += this.primary + char;
			this.primary = '';
		} else if (char === 's') this.changeSign();
		else this.primary += char;
		this.showingResult = false;
		this.update();
	};

	//updates the screen
	this.update = function () {
		this.screenBottom.textContent = toReadable(this.primary);
		this.screenTop.innerHTML = toReadable(this.expression);
		this.screenBottom.scrollLeft = this.screenBottom.scrollWidth;
		this.screenTop.scrollLeft = this.screenBottom.scrollWidth;
	};

	// clears the screen and resets every property to starting value
	this.clear = function () {
		this.screenBottom.textContent = '';
		this.screenTop.textContent = '';

		const temp = new Calculator(screenBottom, screenTop);
		for (key in this) {
			this[key] = temp[key];
		}
	};

	// inserts whatever is left in the bottom screen to the top and calculates
	// the expression from this.expression, fixes the result to 5 decimal points,
	// and makes a new Number from it to remove unnecessary zeroes, and then makes
	// it a string to make sure this.primary retains its methods
	this.operate = function () {
		if (this.showingResult || this.primary.length === 0) return;
		this.primary = addMissingBrackets(this.primary);
		this.expression += this.primary;
		this.expression = MulAroundBrackets(this.expression);
		this.primary = '';
		this.primary = String(
			Number(new Expression(this.expression).result.toFixed(5))
		);
		if (this.primary.length > 15)
			this.primary = new Number(this.primary)
				.toExponential(8)
				.replace(/e/g, '*10^');
		this.expression += '=';
		this.showingResult = true;
		this.update();
	};

	// deletes the last number or operator in this.primary,
	// if this.primary is empty reverses this.expression in
	// this.primary
	this.deleteChar = function () {
		if (this.showingResult) this.clear();
		else if (this.primary.length === 0) {
			this.primary = this.expression;
			this.expression = '';
		}
		this.primary = this.primary.slice(0, this.primary.length - 1);
		this.update();
	};

	//calls this.clear() if a number is inputted after calculating an expression
	//or either way if the expression generated infinity or NaN
	//and clears this.expression either way if called after calculating the expression.
	this.clearAfterResult = function (char) {
		if (this.showingResult) this.expression = '';
		if (
			((!isOperator(char) &&
				!isPower(char) &&
				!isOpeningBracket(char) &&
				char !== '!' &&
				char !== 's') ||
				this.primary === 'Infinity' ||
				this.primary === 'NaN') &&
			this.showingResult
		)
			this.clear();
	};

	// looks for the rightmost valid expression in this.primary
	// and invokes insertSign at it's starting index
	this.changeSign = function () {
		if (!this.primary.length) return;
		for (let i = this.primary.length - 1; i > 0; i--) {
			if (isValidExpression(this.primary.slice(i))) {
				for (let j = i - 1; j > 0; j--) {
					if (
						!isValidExpression(this.primary.slice(j)) ||
						this.primary[j + 1] === '+' ||
						this.primary[j + 1] === '-'
					) {
						this.insertSign(j + 1);
						return;
					}
				}
			}
		}
		this.insertSign(0);
	};

	// inserts a sign or replaces it with its complement at a certain index of
	// this.primary and adds parenthesis after the sign and at the end if there aren't
	this.insertSign = function (index) {
		const isSign = this.primary[index] === '-' || this.primary[index] === '+';
		const wrapped =
			this.primary[index ? index + 1 : isSign ? index + 1 : index] === '(' ||
			this.primary[index ? index + 1 : isSign ? index + 1 : index] === '|';
		this.primary = this.primary.split('');
		this.primary.splice(
			index,
			isSign ? 1 : 0,
			`${this.primary[index] === '-' ? '+' : '-'}${wrapped ? '' : '('}`
		);
		this.primary = this.primary.join('');
		if (!wrapped) this.primary += ')';
	};

	this.back = function () {
		if (!this.showingResult) return;
		this.expression = this.expression.slice(0, this.expression.length - 1);
		this.primary = this.expression;
		this.expression = '';
		this.showingResult = false;
		this.update();
	};
}

// replaces characters used internally by the calculator with
// the ones to be displayed on the screen
function toReadable(str) {
	str = String(str);
	str = str.replace(/\*10\^/g, 'e');
	str = str.replace(/\*/g, '×');
	str = str.replace(/\//g, '÷');
	return str;
}

function isPower(str) {
	return str === '^' || str === '^(1/';
}

// adds any missing closing brackets to the end of the primary
function addMissingBrackets(primary) {
	for (let i = primary.length - 1; i >= 0; i--) {
		if (
			isOpeningBracket(primary[i]) &&
			(primary.match(new RegExp(`\\${primary[i]}`, 'g')) || []).length >
				(
					primary.match(new RegExp(`\\${matchingBracket(primary[i])}`, 'g')) ||
					[]
				).length
		) {
			primary += matchingBracket(primary[i]);
		} else if (primary[i] === '|' && (primary.match(/\|/g) || []).length % 2) {
			primary += '|';
		}
	}
	return primary;
}

function isValidCharacter(str) {
	switch (str) {
		case '!':
		case '(':
		case ')':
		case '[':
		case ']':
		case '{':
		case '}':
		case '|':
		case '.':
			return true;
	}
	return !isNaN(str) || isOperator(str);
}

//adds multiplication signs around opening brackets preceded by numbers or
//closing brackets followed by numbers
function MulAroundBrackets(str) {
	for (let i = 0; i < str.length; i++) {
		if (
			isOpeningBracket(str[i]) &&
			!isOperator(str[i - 1]) &&
			!isOpeningBracket(str[i - 1]) &&
			i
		) {
			str = str.split('');
			str.splice(i, 0, '*');
			str = str.join('');
		}
		if (
			isClosingBracket(str[i]) &&
			!isOperator(str[i + 1]) &&
			!isClosingBracket(str[i + 1]) &&
			i < str.length - 1
		) {
			str = str.split('');
			str.splice(i + 1, 0, '*');
			str = str.join('');
		}
	}
	return str;
}

function isOpeningBracket(char) {
	const brackets = ['(', '[', '{'];
	return brackets.some(bracket => bracket === char);
}

function isClosingBracket(char) {
	const brackets = [')', ']', '}'];
	return brackets.some(bracket => bracket === char);
}
