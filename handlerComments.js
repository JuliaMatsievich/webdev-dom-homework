import { formBlock, listComments } from "./variables.js";
import { comments, fetchPostandRender } from "./script.js";
// import { fetchPost } from "./api.js";
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
export function renderComments(listComments) {

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
export function renderAddForm(formBlock, token) {
	console.log(token);
	console.log(formBlock);
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
	formButton.addEventListener('click', () => {
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
	
		fetchPostandRender({newComment, token});
	
		renderLoading();
		inputComment.value = '';
	});
}


// Обработка добавления комментария
// export function handlerAddComment(formBlock, token) {
// 	const inputComment = formBlock.querySelector('.add-form-text');
// 	const inputName = formBlock.querySelector('.add-form-name');
// 	let inputNameValue = inputName.value;
// 	let inputCommentValue = inputComment.value;

// 	hideError();
// 	if (!isValid(inputNameValue, inputCommentValue)) {
// 		showError(formBlock);
// 		return;
// 	}	

// 	let newComment = {
// 		text: inputComment.value.
// 			replaceAll("<", "&lt;").
// 			replaceAll(">", "&gt;").
// 			replaceAll("/**", "<div class='quote'>").
// 			replaceAll("**/", "</div>"),
// 	}

// 	fetchPostandRender(newComment, token);

// 	renderLoading();
// 	inputComment.value = '';
// }


