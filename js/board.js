'use strict';

// Function - for creating bord
export function crateBoard(rows, grows) {
	const board = document.createElement('div');
	board.classList.add('board');
	document.body.append(board);

	let count = 1;
	rows.map((row, index) => {
		grows.map((grow) => {
			let box = `${grow}${row}`;

			const HTMLbox = document.createElement('div');
			HTMLbox.id = box;
			HTMLbox.classList.add('box');

			((count + index) % 2 != 0) ? HTMLbox.classList.add('with__box')
				: HTMLbox.classList.add('black__box');
			count++;
			board.append(HTMLbox);
		});
	});
	return board;
}


// functioa - for set figures in the boxes
export function setBindFigures(grows, board) {
	const colorWith = 'with';
	const colorBlack = 'black';
	// solders
	grows.forEach(item => {	
		const box = board.querySelector(`#${item}2`);
		setFigure('sol', colorWith, box);
	});
	grows.forEach(item => {	
		const box = board.querySelector(`#${item}7`);
		setFigure('sol', colorBlack, box);
	});


	// with figures
	function withAndBlackFigures(row) {
		const color = (row === 1) ? colorWith : colorBlack;

		grows.forEach(item => {
			const box = board.querySelector(`#${item + row}`);
			if(item == 'a' || item == 'h') {
				setFigure('ship', color, box);

			} else if (item == 'b' || item == 'g') {
				setFigure('horse', color, box);

			} else if (item == 'c' || item == 'f') {
				setFigure('el', color, box);

			} else if (item == 'd') {
				setFigure('queen', color, box);

			} else {
				setFigure('king', color, box);
			}
		});
	}

	withAndBlackFigures(1);
	withAndBlackFigures(8);

}

function setFigure(figureType, color, box) {
	let figure = document.createElement('img');

	figure.dataset.figure = `${figureType}`;
	figure.classList.add(`${color}`);
	figure.src = `img/${color}/${figureType}.png`;
	box.append(figure);
}

