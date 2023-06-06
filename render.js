import { listComments, formBlock } from "./variables.js";
import { initEditButtonEventListeners, initLikeButtonEventListeners, initDeleteButtonEventListeners, initAnswerCommentEventListener } from "./eventlisteners.js";
import { comments, fetchCommentsAndRender } from "./script.js";
import { loginUser } from './api.js';
import { handlerAddComment } from "./handlerAddComments.js";


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
	initLikeButtonEventListeners();
	initEditButtonEventListeners();
	initDeleteButtonEventListeners();
	initAnswerCommentEventListener();
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

	const formButton = formBlock.querySelector('.add-form-button');
	// Подписка на событие клика по кнопке "Написать"
	formButton.addEventListener('click', handlerAddComment);

}

let token = null;

function setToken(newToken) {
	return token = newToken;
}

//Рендер формы входа
export function renderEnterForm() {
	const enterFormHtml = `
		<div class="enter-form">
			<h2 class="enter-title">Форма входа</h2>
			<input type="text" class="enter-form-login" placeholder="Введите ваш логин" />
			<input type="text" class="enter-form-password" placeholder="Введите ваш пароль" />
			<div class="enter-form-row">
				<button class="enter-form-button">Войти</button>
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
	const enterButton = document.querySelector('.enter-form-button');

	regButton.addEventListener('click', () => {
		renderRegisterForm();
	})

	cancelButton.addEventListener('click', () => {
		listComments.classList.remove('hidden');
		fetchCommentsAndRender();
		renderInitialState();
	})

	enterButton.addEventListener('click', () => {
		const login = document.querySelector('.enter-form-login').value;
		const password = document.querySelector('.enter-form-password').value;

		if (!login) {
			alert('Введите логин');
			return;
		}

		if (!password) {
			alert('Введите пароль');
			return;
		}

		loginUser({
			login: login,
			password: password
		})
			.then(user => {
				listComments.classList.remove('hidden');
				setToken(`Bearer ${user.user.token}`);
				fetchCommentsAndRender();
				renderAddForm();
				const inputName = document.querySelector('.add-form-name');
				inputName.value = user.user.name
				inputName.disabled = true;
				console.log(token);
			})
			.catch((error) => {
				alert(error.message);
			})
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

//Рендер начального состояния
export function renderInitialState() {
	const initialHtml = `
	Чтобы добавить комментарий <span class="autorization-button">авторизуйтесь</span>
	`;

	formBlock.innerHTML = initialHtml;

	const autorizationButton = document.querySelector('.autorization-button');

	autorizationButton.addEventListener('click', () => {
		listComments.classList.add('hidden');
		renderEnterForm();
	})
}