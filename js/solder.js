'use strict';

export class SolderFigure {
	constructor(figure, color) {
		this.box = figure.parentElement;
		this.figure = figure;
		this.color = color;

		this.row = +this.box.id[1];
		this.grow = this.box.id[0];
		this.steps = [];
		this.up = (this.color === 'with') ? 1 : -1;
		this.canTwoStep = (this.color === 'with' && this.row === 2) 
			? true : (this.color === 'black' && this.row === 7) ? true
				: false;

	}

	solderSteps(board) {
		const nextBox = board.querySelector(`#${this.grow}${this.row+this.up}`);
		if(!nextBox.firstChild) {
			this.steps.push(nextBox);
		}

		if(this.canTwoStep && !nextBox.firstChild) {
			const secondNextBox = board
				.querySelector(`#${this.grow}${this.row+(this.up*2)}`);

			if(!secondNextBox.firstChild) {
				this.steps.push(secondNextBox);
			}

			return this.steps;
		}
	}

	showValidBoxes() {
		this.figure.classList.add('choosed');
	
		this.steps.forEach(box => {
			const square = document.createElement('div');
			square.classList.add('valid__box');
			box.append(square);
		});
	}

	removeValidBoxes() {
		this.figure.classList.remove('choosed');

		this.steps.forEach(box => {
			if(box.firstChild && box.firstChild.classList.contains('valid__box')) {
				box.firstChild.remove();
			}
		});
	}

	doStep(box, board, chanjeColor) {
		const boxId = (box.classList.contains('valid__box')) ? box.parentElement.id
			: box.id;
		this.removeValidBoxes();

		const newBox = board.querySelector(`#${boxId}`);
		newBox.append(this.figure);
		console.log(newBox);
		this.figure.remove();

		let newfigure = document.createElement('img');

		let imgFigure = this.figure.dataset.figure;

		newfigure.dataset.figure = `${imgFigure}`;
		newfigure.classList.add(`${this.color}`);
		newfigure.src = `img/${this.color}/${imgFigure}.png`;
		newBox.append(newfigure);

		chanjeColor();
	}
}