const calculator = new Calculator(
	document.getElementById('screen-bottom'),
	document.getElementById('screen-top')
);

const buttons = document.querySelectorAll(
	'.digit, .operator, #dot, .parenthesis, #factorial, #sign, #power, #radical, #absolute'
);
const equalBtn = document.getElementById('equal');
const clearBtn = document.getElementById('clear');
const deleteBtn = document.getElementById('delete');

// event listeners for the on screen buttons
buttons.forEach(btn => {
	btn.addEventListener('click', e =>
		calculator.input(
			e.target.value ?? // this is because of the power and radical buttons
				e.target.parentElement.value ??
				e.target.parentElement.parentElement.value
		)
	);
});
equalBtn.addEventListener('click', () => calculator.operate());
clearBtn.addEventListener('click', () => calculator.clear());
deleteBtn.addEventListener('click', () => calculator.deleteChar());

// keyboard support
window.addEventListener('keydown', e => {
	if (isValidCharacter(e.key)) calculator.input(e.key);
	else if (e.key === 'Backspace') calculator.deleteChar();
	else if (e.key === '=') calculator.operate();
	else if (e.key === 'Delete') calculator.clear();
	//alternative for multiplication for non programmers
	else if (e.key === 'x' || e.key === 'X') calculator.input('*');
});
