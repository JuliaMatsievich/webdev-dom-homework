const form = document.querySelector('.add-form');
const inputName = form.querySelector('.add-form-name');
const inputComment = form.querySelector('.add-form-text');
const formButton = form.querySelector('.add-form-button');
const listComments = document.querySelector('.comments');
const error = document.querySelector('.error');
const buttonDelete = document.querySelector('.button-delete');

const comments = [
	{
		name: 'Глеб Фокин',
		date: '12.02.22 12:18',
		text: 'Это будет первый комментарий на этой странице',
		likesCounter: 3,
	},
	{
		name: 'Варвара Н.',
		date: '13.02.22 19:22',
		text: 'Мне нравится как оформлена эта страница! ❤',
		likesCounter: 75,
	}
]

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

	comments.push({
		name: inputName.value,
		date: date,
		text: inputComment.value,
		likesCounter: 0,
	})

	renderComment();

	initialState();
}

// Подписка на события кнопки Редактировать
function initEditButtonEventListeners() {
	const EditButtons = listComments.querySelectorAll('.edit-button');

	for(const EditButton of EditButtons) {
		EditButton.addEventListener('click',(event) => {
			const target = event.target;
			renderEditComment (target)
		})
	}
}

//Создание формы редактирования комментария
function renderEditComment (element) {
	const parent = element.closest('.comment');
	const commentBody = parent.querySelector('.comment-body');
	const commentText = parent.querySelector('.comment-text');
	commentBody.innerHTML = `
	<div class="edit-form">
	<textarea type="textarea" class="edit-form-text" rows="4">${commentText.textContent}</textarea>
	<div class="add-form-row">
	  <button class="edit-form-button">Сохранить</button>
	</div>
	</div>
	`
	const newCommentText = parent.querySelector('.edit-form-text');
	const editButtonSave = parent.querySelector('.edit-form-button');

	editButtonSave.addEventListener('click',() => {
		commentBody.innerHTML = `
		<div class="comment-text">${newCommentText.value}</div>
		`
	})


}

//Рендер комментариве
function renderComment() {
	const commentsHtml = comments.map((comment) => {
		return `
		<li class="comment">
		<div class="comment-header">
		  <div>${comment.name}</div>
		  <div>${comment.date}</div>
		</div>
		<div class="comment-body">
		  <div class="comment-text">${comment.text}</div>
		</div>
		<div class="comment-footer">
		  <div class="likes">
			 <span class="likes-counter" data-likeCounter = "${comment.likesCounter}">${comment.likesCounter}</span>
			 <button class="like-button"></button>
			 <button class="edit-button"></button>
			 <button class="delete-button"></button>
		  </div>
		</div>
	 </li>`
	})

	listComments.innerHTML = commentsHtml.join('');
	initLikeButtonEventListeners();
	initEditButtonEventListeners();
}

//Подписка на события клика по кнопке Лайк
function initLikeButtonEventListeners() {
	const likeButtons = listComments.querySelectorAll('.like-button');
	
	for(const likeButton of likeButtons) {
		likeButton.addEventListener('click', (event) => {	
			const target = event.target;
			const likesParrent = target.closest('.likes');
			const likesCounter = likesParrent.querySelector('.likes-counter')

			if(!likeButton.matches('.-active-like')) {
				likeButton.classList.add('-active-like');
				likesCounter.dataset.likecounter = +likesCounter.dataset.likecounter + 1;
				likesCounter.textContent = likesCounter.dataset.likecounter;				
			} else {
				likeButton.classList.remove('-active-like');
				likesCounter.dataset.likecounter = +likesCounter.dataset.likecounter - 1;
				likesCounter.textContent = likesCounter.dataset.likecounter;
			}
		})
	}
}



renderComment();
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

buttonDelete.addEventListener('click', () => {
	let comment = '<li class="comment">';
	listComments.innerHTML = listComments.innerHTML.slice(0,listComments.innerHTML.lastIndexOf(comment))
})