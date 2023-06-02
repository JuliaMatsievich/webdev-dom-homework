import { listComments, formBlock,autorizationButton } from "./variables.js";
// import {initEditButtonEventListeners, initLikeButtonEventListeners, initDeleteButtonEventListeners, initAnswerCommentEventListener } from "./eventlisteners.js";
import { comments, fetchCommentsAndRender } from "./script.js";
import {initAutorizationEventListener} from "./eventlisteners.js";

//Создание даты в нужном формате
export function renderDate(dataDate) {
	const date = new Date(dataDate);
	const dateDataArr = date.toLocaleDateString().split('.')
	dateDataArr[dateDataArr.length - 1] = dateDataArr[dateDataArr.length - 1].slice(2);
	const dateData = dateDataArr.join('.');

	const time = date.toLocaleTimeString().slice(0, -3);

	return `${dateData} ${time}`;
}


//Создание формы редактирования комментария
export function renderEditComment(element) {
	const parent = element.closest('.comment');
	const commentBody = parent.querySelector('.comment-body');
	const commentText = parent.querySelector('.comment-text');
	const divQuote = commentText.querySelector('.quote');
	const editTextarea = commentText.innerHTML.replaceAll('<div class="quote">', '/**').replaceAll('</div>', '**/');
	commentBody.innerHTML = `
	<div class="edit-form">
	<textarea type="textarea" class="edit-form-text" rows="4">${editTextarea}</textarea>
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

		const newCommentTextValue = newCommentText.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("/**", "<div class='quote'>").replaceAll("**/", "</div>");

		if (divQuote) {
			commentBody.innerHTML = `<div class="comment-text">${newCommentTextValue}</div>`
		} else {
			commentBody.innerHTML = `<div class="comment-text">${newCommentTextValue}</div>`
		}

		comments[commentIndex].text = newCommentTextValue;
	})
}


//Рендер комментариев
export function renderComments() {

	const commentsHtml = comments.map((comment, index) => {
		comment.likeButtonClass = '';

		if (comment.isLiked) {
			comment.likeButtonClass = '-active-like';
		}

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
				 <span class="likes-counter" data-likeCounter = "${comment.likes}">${comment.likes}</span>
				 <button class="like-button ${comment.likeButtonClass}"></button>
				 <button class="edit-button"></button>
				 <button class="delete-button" data-index="${index}"></button>
			  </div>
			</div>
		 </li>`

	})

	listComments.innerHTML = commentsHtml.join('');
	// initLikeButtonEventListeners();
	// initEditButtonEventListeners();
	// initDeleteButtonEventListeners();
	// initAnswerCommentEventListener();
}


//Рендер формы добавления комменатриев
export function renderAddForm() {
	const addFormHtml = `
		<div class="add-form">
			<input type="text" class="add-form-name" placeholder="Введите ваше имя" />
			<textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
			<div class="add-form-row">
				<button class="add-form-button button-disabled ">Написать</button>
		</div>
	`

	formBlock.innerHTML = addFormHtml;

}


//Рендер формы входа
export function renderEnterForm() {
	const enterFormHtml = `
		<div class="enter-form">
			<h2 class="enter-title">Форма входа</h2>
			<input type="text" class="enter-form-login" placeholder="Введите ваш логин" />
			<input type="text" class="enter-form-password" placeholder="Введите ваш пароль" />
			<div class="enter-form-row">
				<button class="enter-form-button button-disabled ">Войти</button>
			</div>
			<div class="enter-form-row">
				<p class="reg-button">Зарегистрироваться</p>
				<p class="cancel-button">Вернуться к просмотру комментариев</p>
			</div
		</div>
	`

	formBlock.innerHTML = enterFormHtml;

	const regButton = document.querySelector('.reg-button');
	const cancelButton = document.querySelector('.cancel-button');

	regButton.addEventListener('click', () => {
		renderRegisterForm();
	})
	cancelButton.addEventListener('click', () => {
		listComments.classList.remove('hidden');
		fetchCommentsAndRender();
		formBlock.innerHTML = `Чтобы добавить комментарий <span class="autorization-button">авторизуйтесь</span>`
		initAutorizationEventListener();
	})

}


//Рендер формы регистрации
export function renderRegisterForm() {
	const registerFormHtml = `
		<div class="enter-form">
			<h2 class="enter-title">Форма регистрации</h2>
			<input type="text" class="enter-form-name" placeholder="Введите ваше имя" />
			<input type="text" class="enter-form-login" placeholder="Введите ваш логин" />
			<input type="text" class="enter-form-password" placeholder="Введите ваш пароль" />
			<div class="enter-form-row">
				<button class="enter-form-button button-disabled ">Зарегистрироваться</button>
			</div>
			<p class="reg-button-auth">Войти как авторизованный пользователь</p>
		</div>
	`

	formBlock.innerHTML = registerFormHtml;

	const regButtonAuth = document.querySelector('.reg-button-auth');

	regButtonAuth.addEventListener('click', () => {
		renderEnterForm()
	})
}