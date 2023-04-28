const form = document.querySelector('.add-form');
const inputName = form.querySelector('.add-form-name');
const inputComment = form.querySelector('.add-form-text');
const formButton = form.querySelector('.add-form-button');
const listComments = document.querySelector('.comments');
const error = document.querySelector('.error');
const buttonDelete = document.querySelector('.button-delete');
//Создание даты в нужном формате
function renderDate() {
	const date = new Date();
	const dateDataArr = date.toLocaleDateString().split('.')
	dateDataArr[dateDataArr.length - 1] = dateDataArr[dateDataArr.length - 1].slice(2);
	const dateData = dateDataArr.join('.');

	const time = date.toLocaleTimeString().slice(0, -3);

	return `${dateData} ${time}`;
}

//Показать ошибку
function showError() {
	error.classList.remove('hidden');
	error.textContent = 'Проверьте введены ли все данные'
}

//Спрятать ошибку
function hideError() {
	error.classList.add('hidden');
}

//Проверка на валидность полей ввода
function isValid() {
	if (inputName.value && inputComment.value) {
		return true;
	} else {
		return false;
	}
}

//Начальное состояние формы
function initialState() {
	inputName.value = '';
	inputComment.value = '';
	formButton.disabled = true;
	formButton.classList.add('button-disabled')
}

// Обработка добавления комментария
function handlerAddComment() {
	hideError();
	if (!isValid()) {
		showError();
		return;
	}
	const date = renderDate();
	const oldListComments = listComments.innerHTML;
	const newListComments = `
	<li class="comment">
	<div class="comment-header">
	  <div>${inputName.value}</div>
	  <div>${date}</div>
	</div>
	<div class="comment-body">
	  <div class="comment-text">
		 ${inputComment.value}
	  </div>
	</div>
	<div class="comment-footer">
	  <div class="likes">
		 <span class="likes-counter">0</span>
		 <button class="like-button -active-like"></button>
	  </div>
	</div>
 </li>`
	listComments.innerHTML = oldListComments + newListComments;
	initialState();
}

initialState();

formButton.addEventListener('click', handlerAddComment);

form.addEventListener('keyup', (event) => {
	if (event.key == 'Enter') {
		handlerAddComment();
	}
});


form.addEventListener('input', () => {
		if (inputName.value && inputComment.value) {
		formButton.disabled = false;
		formButton.classList.remove('button-disabled')
	} else {
		formButton.disabled = true;
		formButton.classList.add('button-disabled')
	}
})

