import { formBlock } from "./variables.js";
import { fetchCommentsAndRenderAuthoriz } from "./script.js";
import { fetchPost } from "./api.js";
import { renderLoading, removerLoading } from "./handlerLoading.js";

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
function isValid(name,comment) {
	if (name && comment) {
		return true;
	} else {
		return false;
	}
}

// Обработка добавления комментария
export function handlerAddComment() {
	const inputComment = formBlock.querySelector('.add-form-text');
	const inputName = formBlock.querySelector('.add-form-name');
	let inputNameValue = inputName.value;
	let inputCommentValue = inputComment.value;

	hideError();
	if (!isValid(inputNameValue, inputCommentValue)) {
		showError(formBlock);
		return;
	}	

	let newComment = {
		text: inputComment.value.
			replaceAll("<", "&lt;").
			replaceAll(">", "&gt;").
			replaceAll("/**", "<div class='quote'>").
			replaceAll("**/", "</div>"),
	}

	fetchPostandRender(newComment, token);

	renderLoading();
	inputComment.value = '';
}

function fetchPostandRender(newComment, token) {
	return fetchPost(newComment, token)
	.then(responseData => {
		fetchCommentsAndRenderAuthoriz(token);
	})
	.catch(error => {
		removerLoading();
		inputComment.value = inputCommentValue;
		if (error.message === 'код 400') {
			alert('Имя и комментарий должны быть не менее 3х символов');
			return;
		}
		if (error.message === 'код 500') {
			fetchPostandRender(newComment, token);
		} else {
			alert(error.message)
		}
	});
}