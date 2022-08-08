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
		} else this.primary += char;
		this.showingResult = false;
		this.update();
	};

	//updates the screen
	this.update = function () {
		this.screenBottom.textContent = toReadable(this.primary);
		this.screenTop.innerHTML = toReadable(this.expression);
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
		this.primary = '';
		this.primary = String(
			Number(new Expression(this.expression).result.toFixed(5))
		);
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
	//and clears this.expression either way if called after calculating the expression.
	this.clearAfterResult = function (char) {
		if (this.showingResult) this.expression = '';
		if (
			!isOperator(char) &&
			!isPower(char) &&
			char !== '!' &&
			this.showingResult
		)
			this.clear();
	};
}

// replaces characters used internally by the calculator with
// the ones to be displayed on the screen
function toReadable(str) {
	str = String(str);
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
			primary[i] === '(' &&
			(primary.match(/\(/g) || []).length > (primary.match(/\)/g) || []).length
		) {
			primary += ')';
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
