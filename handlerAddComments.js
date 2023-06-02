// import { inputName, inputComment } from "./variables.js" ;
// import { renderDate } from "./render.js";
// import { initialState } from './script.js'; 
// import { fetchPost } from "./api.js";
// import { renderLoading } from "./handlerLoading.js";

// export let inputNameValue = '';
// export let inputCommentValue = '';

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

// Обработка добавления комментария
export function handlerAddComment() {
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