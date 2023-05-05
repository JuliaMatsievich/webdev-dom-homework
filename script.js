const form = document.querySelector('.add-form');
const inputName = form.querySelector('.add-form-name');
const inputComment = form.querySelector('.add-form-text');
const formButton = form.querySelector('.add-form-button');
const listComments = document.querySelector('.comments');
const error = document.querySelector('.error');
let quote = '';
let quoteBlock = '';
let quoteArray = [];

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
function showError(element) {
	const divError = document.createElement('div');
	divError.classList.add('error');
	divError.textContent = 'Проверьте введены ли все данные';
	element.appendChild(divError);
}

//Спрятать ошибку
function hideError() {
	const divError = document.querySelector('.error');
	if (divError) {
		divError.remove();
	}
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
	formButton.classList.add('button-disabled');
}

// Обработка добавления комментария
function handlerAddComment() {
	hideError();
	if (!isValid()) {
		showError(form);
		return;
	}
	const date = renderDate();

	comments.push({
		name: inputName.value.
			replaceAll("<", "&lt;").
			replaceAll(">", "&gt;"),
		date: date,
		text: inputComment.value.
			replaceAll("<", "&lt;").
			replaceAll(">", "&gt;").
			replaceAll("/**", "<div class='quote'>").
			replaceAll("**/", "</div>"),
		likesCounter: 0,
	})

	renderComments();
	initialState();
}

// Подписка на события кнопки Редактировать
function initEditButtonEventListeners() {
	const EditButtons = listComments.querySelectorAll('.edit-button');

	for (const EditButton of EditButtons) {
		EditButton.addEventListener('click', (event) => {
			event.stopPropagation();
			const target = event.target;
			renderEditComment(target)
		})
	}
}

//Создание формы редактирования комментария
function renderEditComment(element) {
	const parent = element.closest('.comment');
	const commentBody = parent.querySelector('.comment-body');
	const commentText = parent.querySelector('.comment-text');
	console.log(commentText.textContent);
	commentBody.innerHTML = `
	<div class="edit-form">
	<textarea type="textarea" class="edit-form-text" rows="4">${commentText.textContent}</textarea>
	<div class="add-form-row">
	  <button class="edit-form-button">Сохранить</button>
	</div>
	</div>
	`

	const editForm = parent.querySelector('.edit-form');
	editForm.addEventListener('click', (event) => {
		event.stopImmediatePropagation()
	})
	const newCommentText = parent.querySelector('.edit-form-text');
	const editButtonSave = parent.querySelector('.edit-form-button');
	const commentIndex = parent.dataset.comment;

	editButtonSave.addEventListener('click', (event) => {
		event.stopPropagation();
		if (!newCommentText.value) {
			showError(commentBody);
			return;
		}
		commentBody.innerHTML = `
		<div class="comment-text">${newCommentText.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</div>
		`
		comments[commentIndex].text = newCommentText.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
	})
}

//Рендер комментариев
function renderComments() {

	const commentsHtml = comments.map((comment, index) => {
		
			return `
			<li class="comment" data-comment=${index}>
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
				 <button class="delete-button" data-index="${index}"></button>
			  </div>
			</div>
		 </li>`
		
	})

	listComments.innerHTML = commentsHtml.join('');
	initLikeButtonEventListeners();
	initEditButtonEventListeners();
	initDeleteButtonEventListeners();
	initAnswerCommentEventListener();
}

//Подписка на события клика по кнопке Лайк
function initLikeButtonEventListeners() {
	const likeButtons = listComments.querySelectorAll('.like-button');

	for (const likeButton of likeButtons) {
		likeButton.addEventListener('click', (event) => {
			event.stopPropagation();
			const target = event.target;
			const likesParrent = target.closest('.likes');
			const likesCounter = likesParrent.querySelector('.likes-counter')

			if (!likeButton.matches('.-active-like')) {
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

//Подписка на кнопку Удалить комменатрий
function initDeleteButtonEventListeners() {

	const deleteButtons = document.querySelectorAll('.delete-button');

	for (const deleteButton of deleteButtons) {
		deleteButton.addEventListener('click', (event) => {
			event.stopPropagation();
			const index = deleteButton.dataset.index;
			comments.splice(index, 1);
			renderComments();
		})

	}
}

//Подписка на событие ответить на комментарий
function initAnswerCommentEventListener() {
	const commentElements = document.querySelectorAll('.comment');

	for (const commentElement of commentElements) {
		commentElement.addEventListener('click', (event) => {
			const index = commentElement.dataset.comment;

			quoteBlock = `/** ${comments[index].name}:\n${comments[index].text} **/`;

			inputComment.value = `${quoteBlock}\n\n`;

			inputComment.focus();
		})
	}
}

renderComments();

initialState();

formButton.addEventListener('click', handlerAddComment);

//Подписка на создание комментария нажатием клавиши Enter
form.addEventListener('keyup', (event) => {
	if (event.key == 'Enter') {
		handlerAddComment();
	}
});

//Подписка на активность/неактивность кнопки "Написать"
form.addEventListener('input', () => {
	if (inputName.value && inputComment.value) {
		formButton.disabled = false;
		formButton.classList.remove('button-disabled')
	} else {
		formButton.disabled = true;
		formButton.classList.add('button-disabled')
	}
})

