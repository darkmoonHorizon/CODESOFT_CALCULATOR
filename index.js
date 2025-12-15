const currentDisplay = document.getElementById('current');
const previousDisplay = document.getElementById('previous');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const backspaceButton = document.getElementById('backspace');
const resetHistoryButton = document.getElementById('resetHistory');

let currentInput = '';
let previousInput = '';
let operator = '';

function loadState() {
    const saved = localStorage.getItem('calculatorState');
    if (saved) {
        const state = JSON.parse(saved);
        currentInput = state.currentInput || '';
        previousInput = state.previousInput || '';
        operator = state.operator || '';
        updateDisplay();
    }
}
function saveState() {
    const state = {
        currentInput,
        previousInput,
        operator
    };
    localStorage.setItem('calculatorState', JSON.stringify(state));
}
function updateDisplay() {
    currentDisplay.value = currentInput || '0';
    previousDisplay.textContent = previousInput + ' ' + operator;
}
function inputNumber(num) {
    if (currentInput.length >= 15) return;
    if (num === '.' && currentInput.includes('.')) return;
    
    currentInput += num;
    updateDisplay();
    saveState();
}
function inputOperator(op) {
    if (currentInput === '') return;
    
    if (previousInput !== '') {
        calculate();
    }
    
    operator = op;
    previousInput = currentInput;
    currentInput = '';
    updateDisplay();
    saveState();
}
function calculate() {
    if (currentInput === '' || previousInput === '' || operator === '') return;
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert("Can't divide by zero!");
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }
    

    result = Math.round(result * 1000000) / 1000000;
    

    const history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    history.push({
        equation: `${previousInput} ${operator} ${currentInput}`,
        result: result,
        time: new Date().toLocaleTimeString()
    });
    

    if (history.length > 20) {
        history.shift();
    }
    
    localStorage.setItem('calcHistory', JSON.stringify(history));
    
    currentInput = result.toString();
    previousInput = '';
    operator = '';
    updateDisplay();
    saveState();
}


function clearAll() {
    currentInput = '';
    previousInput = '';
    operator = '';
    updateDisplay();
    saveState();
}


function backspace() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
    saveState();
}


function resetHistory() {
    if (confirm('Clear all calculation history?')) {
        localStorage.removeItem('calcHistory');
        alert('History cleared!');
    }
}


document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    if (key >= '0' && key <= '9') inputNumber(key);
    if (key === '.') inputNumber('.');
    
    if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault();
        inputOperator(key);
    }
    
    if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    }
    
    if (key === 'Escape') clearAll();
    if (key === 'Backspace') backspace();
    if (key === '%') inputOperator('%');
});
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        inputNumber(button.getAttribute('data-value'));
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        inputOperator(button.getAttribute('data-value'));
    });
});

equalsButton.addEventListener('click', calculate);
clearButton.addEventListener('click', clearAll);
backspaceButton.addEventListener('click', backspace);
resetHistoryButton.addEventListener('click', resetHistory);


loadState();
updateDisplay();