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

buttons.forEach(btn => {
	btn.addEventListener('click', e =>
		calculator.input(
			e.target.value ??
				e.target.parentElement.value ??
				e.target.parentElement.parentElement.value
		)
	);
});
equalBtn.addEventListener('click', () => calculator.operate());
clearBtn.addEventListener('click', () => calculator.clear());
deleteBtn.addEventListener('click', () => calculator.deleteChar());

window.addEventListener('keydown', e => {
	if (isValidCharacter(e.key)) calculator.input(e.key);
	else if (e.key === 'Backspace') calculator.deleteChar();
	else if (e.key === 'Enter' || e.key === '=') calculator.operate();
	else if (e.key === 'Delete') calculator.clear();
});
