import { fetchGet, fetchPost } from "./api.js";
import { inputName, inputComment, listComments, formButton, form } from "./variables.js";
import { renderDate } from './render.js';
import { renderLoading, removerLoading } from "./handlerLoading.js" ;

export let inputNameValue = '';
export let inputCommentValue = '';

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
export function initialState() {
	inputName.value = '';
	inputComment.value = '';
	formButton.disabled = true;
	formButton.classList.add('button-disabled');
}

// Обработка добавления комментария
function handlerAddComment() {
	inputNameValue = inputName.value;
	inputCommentValue = inputComment.value;

	hideError();
	if (!isValid()) {
		showError(form);
		return;
	}
	const date = renderDate();

	let newComment = {
		name: inputName.value.
			replaceAll("<", "&lt;").
			replaceAll(">", "&gt;"),
		date: date,
		text: inputComment.value.
			replaceAll("<", "&lt;").
			replaceAll(">", "&gt;").
			replaceAll("/**", "<div class='quote'>").
			replaceAll("**/", "</div>"),
		likes: 0,
		forceError: true
	}

	fetchPost(newComment);
	renderLoading();
	initialState();
}

listComments.textContent = 'Подождите, пожалуйста, комментарии загружаются...';
initialState();
fetchGet();


	// .then(responseData => {
	// 	const appcomments = responseData.comments.map((comment) => {
	// 		return {
	// 			name: comment.author.name,
	// 			date: renderDate(comment.date),
	// 			text: comment.text,
	// 			likes: comment.likes,
	// 			isLiked: false,
	// 			forceError: true
	// 		}
	// 	})
	// 	comments = appcomments;
	// 	renderComments();
	// 	removerLoading();
	// })

//Подписка на событие клика по кнопке "Написать"
formButton.addEventListener('click', handlerAddComment);

//Подписка на создание комментария нажатием клавиши Enter
form.addEventListener('keyup', (event) => {
	if (event.key === 'Enter') {
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

