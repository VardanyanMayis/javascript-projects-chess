'use strict';

// All Figures
class Figures {
	constructor(figure, color) {
		this.grows = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
		this.steps = [];
		this.hitSteps = [];
		this.box = figure.parentElement;
		this.figure = figure;
		this.color = color;
	}

	showValidBoxes() {
		if(this.steps.length > 0) this.figure.classList.add('choosed');
	
		this.steps.forEach(box => {
			const square = document.createElement('div');
			square.classList.add('valid__box');
			box.append(square);
		});

		this.hitSteps.forEach(box => {
			document.querySelector(`#${box}`).classList.add('hit__box');
		});
	}

	removeValidBoxes() {
		this.figure.classList.remove('choosed');

		this.steps.forEach(box => {
			if(box.firstChild && box.firstChild.classList.contains('valid__box')) {
				box.firstChild.remove();
			}
		});
		this.hitSteps.forEach(box => {
			document.querySelector(`#${box}`).classList.remove('hit__box');
		});
	}

	doStep(box, board) {
		const boxId = (box.classList.contains('valid__box')) ? box.parentElement.id
			: box.id;
		this.removeValidBoxes();

		const newBox = board.querySelector(`#${boxId}`);
		newBox.append(this.figure);
		this.figure.remove();

		let newfigure = document.createElement('img');

		let imgFigure = this.figure.dataset.figure;

		newfigure.dataset.figure = `${imgFigure}`;
		newfigure.classList.add(`${this.color}`);
		newfigure.src = `img/${this.color}/${imgFigure}.png`;
		newBox.append(newfigure);
		if(this.figure.dataset.figure === 'sol') this.chanjeSolder(newBox);
	}

	hit(box) {
		// console.log(box);
		this.removeValidBoxes();
		const newBox = box.parentElement;
		box.remove();
		// box.querySelector('img').remove();

		box.append(this.figure);
		this.figure.remove();

		let newfigure = document.createElement('img');

		let imgFigure = this.figure.dataset.figure;

		newfigure.dataset.figure = `${imgFigure}`;
		newfigure.classList.add(`${this.color}`);
		newfigure.src = `img/${this.color}/${imgFigure}.png`;
		newBox.append(newfigure);
		if(this.figure.dataset.figure === 'sol') this.chanjeSolder(newBox);

	}
}


// Solder
export class SolderFigure extends Figures {
	constructor(figure, color, changeFunction) {
		super(figure, color);
		this.changeFunction = changeFunction;

		this.row = +this.box.id[1];
		this.grow = this.box.id[0];
		this.up = (this.color === 'with') ? 1 : -1;
		this.canTwoStep = (this.color === 'with' && this.row === 2) 
			? true : (this.color === 'black' && this.row === 7) ? true
				: false;
	}

	Steps(board) {
		const nextBox = board.querySelector(`#${this.grow}${this.row+this.up}`);
		let hitRow = this.row + this.up;

		function getHitBoxes(next, grow, grows, color) {
			let numberOfLetter = (next) ? grows.indexOf(grow) + 1
				: grows.indexOf(grow) - 1;
			if(numberOfLetter >= 0 && numberOfLetter <= 7){
				let idOfBox = `${grows[numberOfLetter]}${hitRow}`;

				const hitBox = board.querySelector(`#${idOfBox}`);
				if(hitBox.firstChild) {
					if(!hitBox.firstChild.classList.contains(color)) {
						return idOfBox;
					}
				}
			}
		}

		let rigthBox = getHitBoxes(true, this.grow, this.grows, this.color);
		let leftBox = getHitBoxes(false, this.grow, this.grows, this.color);
		if(leftBox) {
			this.hitSteps.push(leftBox);
		}
		if(rigthBox) {
			this.hitSteps.push(rigthBox);
		}

		if(!nextBox.firstChild) {
			this.steps.push(nextBox);
		}

		if(this.canTwoStep && !nextBox.firstChild) {
			const secondNextBox = board
				.querySelector(`#${this.grow}${this.row+(this.up*2)}`);

			if(!secondNextBox.firstChild) {
				this.steps.push(secondNextBox);
			}

			return [this.steps, this.hitSteps];
		}
	}

	chanjeSolder(newBox) {
		if((this.row === 2 && this.color === 'black') || 
			(this.row === 7 && this.color === 'with')) {
			const newFigureProm = this.changeFunction(this.color);
			newFigureProm.then(data => {
				console.log('change');
				const newfigure = document.createElement('img');
				newfigure.dataset.figure = `${data}`;
				newfigure.classList.add(`${this.color}`);
				newfigure.src = `img/${this.color}/${data}.png`;
				newBox.innerHTML = '';
				newBox.append(newfigure);
				// this.figure.parentElement.append(newfigure);
			});
		} 
	}

}