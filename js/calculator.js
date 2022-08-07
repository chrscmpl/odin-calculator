function Calculator(screenBottom, screenTop) {
	this.screenBottom = screenBottom;
	this.screenTop = screenTop;

	this.primary = '';
	this.expression = [''];

	//adds the input plus this.primary to this.expression if
	//the input is an operator, and this.primary is a valid expression
	//otherwise adds the input to this.primary
	//calls this.update()
	this.input = function (str) {
		if (this.isSeparator(str) && isValid(this.primary)) {
			this.insert(this.primary + str);
			this.primary = str.includes('?') ? '(' : '';
		} else this.primary += str;
		this.update();
	};

	// if this.expression's last element has a ? in it, it appends the
	// primary to this.expression, and if it doesn't contain another ?
	// it calls this.merge()
	// if this.expression's last element does not have a ? in it, it
	// appends primary to that instead
	this.insert = function (primary) {
		if (this.expression[this.expression.length - 1].includes('?')) {
			this.expression.push(primary);
			if (!primary.includes('?')) this.expression = this.merge(this.expression);
		} else this.expression[this.expression.length - 1] += primary;
	};

	// starting from top to bottom, it tries to replace the ?s in this.expression's
	// elements with the next element, until it reaches the 0 index or it finds a non
	// valid expression (after the first one is not valid everyone after it should
	// contain a ? making it non valid)
	this.merge = function (expression) {
		for (let i = expression.length - 1; i > 0; i--) {
			if (isValid(expression[i])) {
				expression[i - 1] = expression[i - 1].replace('?', expression[i]);
				expression.pop();
			}
		}
		return expression;
	};

	//updates the screen
	this.update = function () {
		this.screenBottom.textContent = this.toReadable(this.primary);
		this.screenTop.innerHTML = this.toReadable(this.expression[0]);
	};

	// replaces characters used internally by the calculator with
	// the ones to be displayed on the screen
	this.toReadable = function (str) {
		str = str.replace(/\*/g, '×');
		str = str.replace(/\//g, '÷');
		return str;
	};

	// returns true if this.primary should be added to this.expression
	// after inserting them
	this.isSeparator = function (str) {
		const separators = ['+', '-', '*', '/', '%', '^?', '^(1/?)'];
		return separators.some(separator => separator === str);
	};

	// this.print = function (char) {
	// 	this.printToBottom(char);
	// 	this.printToTop(char);
	// };

	// this.printToBottom = function (str) {
	// 	this.screenBottom.textContent += str;
	// 	this.screenBottom.scrollLeft = this.screenBottom.scrollWidth;
	// };

	// //updates the top screen with the content of the bottom screen if
	// //the function was called without arguments or the argument is an
	// //operator and the content of the bottom screen is a valid expression
	// this.printToTop = function (char) {
	// 	if (
	// 		char === undefined ||
	// 		(isOperator(this.toUsable(char)) &&
	// 			!isNaN(
	// 				new Expression(
	// 					this.screenBottom.textContent.slice(
	// 						0,
	// 						this.screenBottom.textContent.length - 1
	// 					)
	// 				).result
	// 			))
	// 	) {
	// 		this.screenTop.textContent += this.screenBottom.textContent;
	// 		this.screenBottom.textContent = '';
	// 	}
	// };

	// // prints the rest of the contents of the bottom screen to the top,
	// // calculates an expression from the content of the top screen after
	// // calling toUsable to replace invalid characters, takes the result
	// // and fixes it to 5 decimal points, and makes a new Number from it to
	// // remove unnecessary zeroes, and puts the result in the bottom screen;
	// this.operate = function () {
	// 	this.printToTop();
	// 	this.printToBottom(
	// 		Number(
	// 			new Expression(
	// 				this.toUsable(this.screenTop.textContent)
	// 			).result.toFixed(5)
	// 		)
	// 	);
	// };

	// // clears the screen and resets every property to starting value
	// this.clear = function () {
	// 	this.screenBottom.textContent = '';
	// 	this.screenTop.textContent = '';

	// 	const temp = new Calculator(screenBottom, screenTop);
	// 	for (key in this) {
	// 		this[key] = temp[key];
	// 	}
	// };

	// // deletes the last number or operator inserted in the bottom screen
	// this.deleteChar = function () {
	// 	this.screenBottom.textContent = this.screenBottom.textContent.slice(
	// 		0,
	// 		this.screenBottom.textContent.length - 1
	// 	);
	// };

	// // regex :c
	// this.toUsable = function (expression) {
	// 	expression = expression.replace(/\s/g, '');
	// 	expression = expression.replace(/×/g, '*');
	// 	expression = expression.replace(/÷/g, '/');
	// 	return expression;
	// };
}
