'use strict';

export function ModalForNewFigure(color) {
	const modal = document.querySelector('.modal');
	modal.classList.remove('hidden');
	modal.classList.add('show');

	const figures = ['horse', 'el', 'ship', 'queen'];
	const contantBox = modal.querySelector('.choose__figure__box');

	figures.forEach(item => {
		const block = document.createElement('div');
		block.classList.add('choose__figure');
		block.innerHTML = `<img src='img/${color}/${item}.png'
            data-figure='${item}'>`;

		contantBox.append(block);
	});

	return new Promise(resolve => {
		contantBox.addEventListener('click', (event) => {
			event.preventDefault();
    
    
			if(event.target.dataset.figure) {
				contantBox.innerHTML = '';
				modal.classList.add('hidden');
				modal.classList.remove('show');
    
				resolve(event.target.dataset.figure);
			}
		});
	});
}
