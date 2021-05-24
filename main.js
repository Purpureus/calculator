function toArray(list) {
	return(Array.prototype.slice.call(list));
}
function replaceAt(string, index, value) {
	return(string.substring(0, index) + value + string.substring(index+1));
}
function log(msg) {
	console.log(msg);
}

let lTerm = "0";
let op = "";
let rTerm = "";
let maxDigits = 18;

let logCls;
let logScreen = document.getElementById("console");
let screen = document.getElementById("screen");
let buttons = document.getElementsByClassName("btn");
let numberButtons = document.getElementsByClassName("num");

toArray(buttons).forEach(button =>
{
	button.addEventListener("click", (e) => {
		handleCommand(e.target.dataset.cmd);
	});
});

document.addEventListener("keydown", e =>
{
	switch(e.key)
	{
		case "=": case "Enter":
			handleCommand("="); break;
		case "Escape":
			handleCommand("cl"); break;
		case "Backspace":
			handleCommand("del"); break;
		default:
		{
			if(e.key.match(/[1234567890\.\+\-\*\/]/))
				handleCommand(e.key.toString());
		}
	}
});

function consoleLog(message)
{
	logScreen.textContent = message;
	
	clearTimeout(logCls);
	logCls = setTimeout(() => {
		logScreen.textContent = "";
	}, 2500);
}

function updateScreen()
{
	let cutLTerm = lTerm;
	let cutRTerm = rTerm;
	if(lTerm.length > maxDigits)
		cutLTerm = parseFloat(lTerm).toExponential(maxDigits-6).toString();
	if(rTerm.length > maxDigits)
		cutRTerm = parseFloat(rTerm).toExponential(maxDigits-6).toString();

	screen.innerHTML = `\
		<div id="l-term">${cutLTerm}</div>\
		<div id="op"    >${op      }</div>\
		<div id="r-term">${cutRTerm}</div>`;
}

function addToken(token, isOp=0)
{
	if(isOp)
	{
		op = token;
	}
	else
	{
		if(op == "")
		{
			if(lTerm.length < maxDigits) lTerm += token;
			else consoleLog("Character limit reached");
		}
		else
		{
			if(rTerm.length < maxDigits) rTerm += token;
			else consoleLog("Character limit reached");
		}
	}
}

function clearScreen()
{
	lTerm = "0";
	op = "";
	rTerm = "";
}

function delChar()
{
	if(rTerm)
		rTerm = rTerm.slice(0,-1);

	else if(op)
		op = "";

	else
	{
		if(lTerm.length > 1)
			lTerm = lTerm.slice(0,-1);
		else if(lTerm != "0")
			lTerm = "0";
	}
}

function operate(n1, n2, op)
{
	switch(op)
	{
		case "+": return n1 + n2;
		case "-": return n1 - n2;
		case "*": return n1 * n2;
		case "/": return n1 / n2;
		default: return 0;
	}
}

function solveOperation()
{
	if(op && rTerm)
	{
		let result = 0;
		if(op == "/" && rTerm == "0")
		{
			consoleLog("Error: can't divide by zero");
			result = "0";
		}
		else
		{
			result = operate(parseFloat(lTerm), parseFloat(rTerm), op).toString();
		}
		lTerm = result;
		op = "";
		rTerm = "";
	}
}

function handleCommand(command)
{
	switch(command)
	{
		case "=": solveOperation(); break;
		case "cl": clearScreen(); break;
		case "del": delChar(); break;

		case "+": case "-":
		case "*": case "/":
		{
			if(op && rTerm) solveOperation();
			op = command;
		} break;

		case ".":
		{
			if(op)
			{
				if(!rTerm)
					rTerm = "0" + command;

				else if(!rTerm.includes("."))
					addToken(command);
			}
			else if(!lTerm.includes("."))
				addToken(command);
		} break;

		case "0":
		{
			if((op && rTerm != "0") || lTerm != "0")
				addToken(command);
		} break;

		case "1": case "2": case "3": 
		case "4": case "5": case "6": 
		case "7": case "8": case "9": 
		{
			if(op)
			{
				if(rTerm == "0") rTerm = "";
			}
			else
			{
				if(lTerm == "0") lTerm = "";
			}
			
			addToken(command);
		} break;
	}

	updateScreen();
}

updateScreen();