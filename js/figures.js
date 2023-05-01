'use strict';

// All Figures
class Figures {
	constructor(figure, color) {
		this.grows = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
		this.rows = [1, 2, 3, 4, 5, 6, 7, 8];
		this.figure = figure;
		this.color = color;
		this.box = figure.parentElement;
		this.steps = [];

		this.row = +this.box.id[1];
		this.grow = this.box.id[0];
		this.hitSteps = [];
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


// Ship
export class ShipFigure extends Figures {
	constructor(figure, color) {
		super(figure, color);
	}

	Steps(board) {
		const prevRows = this.rows.slice(0, this.rows.indexOf(this.row)).reverse();
		const nextRows = this.rows.slice(this.rows.indexOf(this.row) + 1);

		const prevGrows = this.grows.slice(0, this.grows.indexOf(this.grow)).reverse();
		const nextGrows = this.grows.slice(this.grows.indexOf(this.grow) + 1);

		function getGrowSteps(arr, row, hitSteps, color) {
			const steps = [];
			for(let item of arr) {
				const box = board.querySelector(`#${item}${row}`);
				if(!box.querySelector('img')) {
					steps.push(box);
				} else {
					if(!box.querySelector('img').classList.contains(color)) {
						hitSteps.push(`${item}${row}`);
					}
					break;
				}
			}
			return steps;
		}

		function getRowSteps(arr, grow, hitSteps, color) {
			const steps = [];
			for(let item of arr) {
				const box = board.querySelector(`#${grow}${item}`);
				if(!box.querySelector('img')) {
					steps.push(box);
				} else {
					if(!box.querySelector('img').classList.contains(color)) {
						hitSteps.push(`${grow}${item}`);
					}
					break;
				}
			}
			return steps;
		}

		setValidSteps( getGrowSteps(prevGrows, this.row, this.hitSteps, this.color), 
			this.steps);
		setValidSteps( getGrowSteps(nextGrows, this.row, this.hitSteps, this.color),
			this.steps);
		setValidSteps( getRowSteps(prevRows, this.grow, this.hitSteps, this.color),
			this.steps);
		setValidSteps(getRowSteps(nextRows, this.grow, this.hitSteps, this.color),
			this.steps);

		function setValidSteps(arr, Steps) {
			Steps.push(...arr);
		}

		return [this.steps, this.hitSteps];
	}
}


export class HorseFigure extends Figures {
	constructor(figure, color) {
		super(figure, color);
	}

	Steps(board) {
		const row = this.row;
		const grow = this.grows.indexOf(this.grow);

		if(row + 1 <= 8 && grow + 2 <= 7) {
			getValidBoxes(this.grows[grow+2], row+1, this.steps, this.hitSteps, this.color);
		}
		if(row + 1 <= 8 && grow - 2 >= 0) {
			getValidBoxes(this.grows[grow-2], row+1, this.steps, this.hitSteps, this.color);
		}
		if(row + 2 <= 8 && grow - 1 >= 0) {
			getValidBoxes(this.grows[grow-1], row+2, this.steps, this.hitSteps, this.color);
		}
		if(row + 2 <= 8 && grow + 1 <= 7) {
			getValidBoxes(this.grows[grow+1], row+2, this.steps, this.hitSteps, this.color);
		}
		if(row - 1 >= 1 && grow + 2 <= 7) {
			getValidBoxes(this.grows[grow+2], row-1, this.steps, this.hitSteps, this.color);
		}
		if(row - 1 >= 1 && grow - 2 >= 0) {
			getValidBoxes(this.grows[grow-2], row-1, this.steps, this.hitSteps, this.color);
		}
		if(row - 2 >= 1 && grow - 1 >= 0) {
			getValidBoxes(this.grows[grow-1], row-2, this.steps, this.hitSteps, this.color);
		}
		if(row - 2 >= 1 && grow + 1 <= 7) {
			getValidBoxes(this.grows[grow+1], row-2, this.steps, this.hitSteps, this.color);
		}

		function getValidBoxes(grow, row, validStaps, hitStaps, color) {
			const box = board.querySelector(`#${grow}${row}`);
			if(!box.querySelector('img')) {
				validStaps.push(box);
			} else {
				if(!box.querySelector('img').classList.contains(color)) {
					hitStaps.push(`${grow}${row}`);
				}
			}
		}


		return [this.steps, this.hitSteps];
	}
}