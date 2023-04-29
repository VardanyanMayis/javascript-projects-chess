'use strict';

// import modules
import {crateBoard, setBindFigures} from './board.js';
import {SolderFigure} from './solder.js';


// set settings
const rows = [1, 2, 3, 4, 5, 6, 7, 8].reverse();
const grows = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const board = crateBoard(rows, grows);
let currentFigure;
let validSteps = [];
let whoStep = 'with';

// start program work
setBindFigures(grows, board);

board.addEventListener('click', (event) => {
	event.preventDefault();
	const box = event.target;

	if(box.classList.contains(whoStep)) {
		// if(currentFigure) currentFigure.removeValidBoxes();
		const board = document.querySelector('.board');

		currentFigure = getFigureType(box);
		validSteps = currentFigure.solderSteps(board);
		if(validSteps != 0) {
			currentFigure.showValidBoxes();
			validSteps = currentFigure.steps;

			validSteps.forEach(box => {
				box.addEventListener('click', bindStap);
			});

			console.log(validSteps);
		}
		// chanjeStep();
	}
});

function bindStap(event) {
	event.preventDefault();
	currentFigure.doStep(event.target, board, chanjeStep);
	validSteps.forEach(item => {
		item.removeEventListener('click', bindStap);
	});
}

// Functions and classes

// get type of figure for choose class for it\
function getFigureType(box) {
	const figure = box.dataset['figure'];

	if(figure === 'sol') {
		const solder = new SolderFigure(box, whoStep);
		console.log(validSteps);
		
		return solder;
	}
}

function chanjeStep() {
	whoStep = (whoStep === 'with') ? 'black' : 'with';
}
