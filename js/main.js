'use strict';

// import modules
import {crateBoard, setBindFigures} from './board.js';
import {ModalForNewFigure} from './solder_modal.js';
import {SolderFigure, ShipFigure, HorseFigure,
	ElephantFigure, QuinFigure, KingFigure} from './figures.js';


// set settings
const rows = [1, 2, 3, 4, 5, 6, 7, 8].reverse();
const grows = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const board = crateBoard(rows, grows);
let currentFigure;
let validSteps = [];
let getSteps = [];
let whoStep = 'with';

// start program work
setBindFigures(grows, board);

board.addEventListener('click', EventForBoard);


function EventForBoard(event) {
	event.preventDefault();
	const box = event.target;

	if(box.classList.contains(whoStep)) {
		if(currentFigure) currentFigure.removeValidBoxes();
		const board = document.querySelector('.board');

		console.log(box);
		currentFigure = getFigureType(box);
		if(currentFigure) {

			validSteps = currentFigure.Steps(board);
			console.log(validSteps);
			getSteps = currentFigure.hitSteps;
			if(validSteps != 0 || getSteps != 0) {
				currentFigure.showValidBoxes();
				validSteps = currentFigure.steps;

				validSteps.forEach(box => {
					box.addEventListener('click', bindStap);
				});
				getSteps.forEach(item => {
					const hitBox = board.querySelector(`#${item}`);
					hitBox.addEventListener('click', hitStep);
				});
			}
		} else {
			getSteps = [];
		}
	}
}

// Functions and classes

function hitStep(event) {
	event.preventDefault();
	currentFigure.hit(event.target, chanjeStep);
	removeMoveEvents();
}

function bindStap(event) {
	event.preventDefault();
	currentFigure.doStep(event.target, board, chanjeStep);
	removeMoveEvents();
}


function removeMoveEvents() {
	validSteps.forEach(item => {
		item.removeEventListener('click', bindStap);
	});
	getSteps.forEach(box => {
		const hitBox = board.querySelector(`#${box}`);
		hitBox.removeEventListener('click', hitStep);
	});
	chanjeStep();
}


// get type of figure for choose class for it\
function getFigureType(box) {
	const figure = box.dataset['figure'];

	console.log(box.parentElement);
	console.log(getSteps);
	if(getSteps != 0) return;

	if(figure === 'sol') {
		return new SolderFigure(box, whoStep, ModalForNewFigure);
	} else if(figure === 'ship') {
		return new ShipFigure(box, whoStep);
	} else if(figure == 'horse') {
		return new HorseFigure(box, whoStep);
	} else if(figure == 'el') {
		return new ElephantFigure(box, whoStep);
	} else if(figure == 'queen') {
		return new QuinFigure(box, whoStep);
	} else if(figure == 'king') {
		return new KingFigure(box, whoStep);
	}
}

function chanjeStep() {
	whoStep = (whoStep === 'with') ? 'black' : 'with';
}
